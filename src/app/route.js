import { reject, uniq } from 'lodash'
import polyline from '@mapbox/polyline'
import { getRoute, getTraceAttributes, valhallaResponseToPolylineCoordinates } from '../lib/valhalla'
import { parseSegmentId } from '../lib/tiles'
import { fetchDataTiles } from './data'
import { addSpeedToMapGeometry, prepareSpeedsForBarChart } from './processing'
import { getRouteTime } from './route-time'
import { startLoading, stopLoading, hideLoading } from '../store/actions/loading'
import { clearBarchart, addSegmentsToBarchart } from '../store/actions/barchart'
import { setGeoJSON } from '../store/actions/view'
import {
  clearRouteSegments,
  setRouteSegments,
  setRouteError,
  setRoute,
  clearRoute,
  clearRouteError,
  setBaselineTime,
  setTrafficRouteTime
} from '../store/actions/route'
import store from '../store'

function resetRouteState () {
  store.dispatch(clearRoute())
  store.dispatch(clearRouteError())
  store.dispatch(clearRouteSegments())
}

const PI = 3.14159265
const RAD_PER_DEG = PI / 180.0
const kRadEarthMeters = 6378160.187
// Calculates the distance between two lat/lng's in meters. Uses spherical
// geometry (law of cosines).
export function Distance(ll1, ll2) {
  // If points are the same, return 0
  if (ll1 === ll2)
    return 0.0

 // Delta longitude. Don't need to worry about crossing 180
  // since cos(x) = cos(-x)
  const deltalng = (ll2[1] - ll1[1]) * RAD_PER_DEG;
  const a = ll1[0] * RAD_PER_DEG;
  const c = ll2[0] * RAD_PER_DEG;

 // Find the angle subtended in radians (law of cosines)
  const cosb = (Math.sin(a) * Math.sin(c)) + (Math.cos(a) * Math.cos(c) * Math.cos(deltalng));

 // Angle subtended * radius of earth (portion of the circumference).
  // Protect against cosb being outside -1 to 1 range.
  if (cosb >= 1.0)
    return 0.00001
  else if (cosb < -1.0)
    return PI * kRadEarthMeters;
  else
    return (Math.acos(cosb) * kRadEarthMeters)
}

/**
 * Returns the point a specified percentage along a segment from this point
 * to an end point.
 * @param  begin  Begin point.
 * @param  end  End point.
 * @param  pct  Percentage along the segment.
 * @return Returns the point along the segment.
 */
 export function along_segment(beginll, endll, pct) {
    const lat = beginll[0] + (endll[0] - beginll[0]) * pct
    const lng = beginll[1] + (endll[1] - beginll[1]) * pct
    return {lat,lng}
  }


export function showRoute (waypoints) {
  if (waypoints.length <= 1) {
    resetRouteState()
    return
  }

  store.dispatch(startLoading())

  // Fetch route from Valhalla-based routing service, given waypoints.
  const host = store.getState().config.valhallaHost
  getRoute(host, waypoints)
    // Get the reference speed from Valhalla route response
    .then(response => {
      const time = response.trip.summary.time
      store.dispatch(setBaselineTime(time))
      return response
    })
    // Transform Valhalla response to polyline coordinates for trace_attributes request
    .then(valhallaResponseToPolylineCoordinates)
    // Make an additional trace_attributes request. This gives us information
    // we need for the visualization.
    .then(coordinates => getTraceAttributes(host, coordinates))
    // This `catch` statement is placed here to handle errors from Fetch API.
    .catch(error => {
      store.dispatch(hideLoading())
      const message = (typeof error === 'object' && error.error)
        ? error.error
        : error

      store.dispatch(setRouteError(message))
      // re-throw to prevent the later chain from executing
      throw new Error(message)
    })
    // If we're here, the network requests have succeeded. We now need to
    // parse the response from `trace_attributes`. Here, we obtain the
    // OSMLR segment ids for each edge.
    .then(response => {
      const segments = []
      const segmentIds = []

      // Decode the polyline and render it to the map
      const coordinates = polyline.decode(response.shape, 6)
      store.dispatch(setRoute(coordinates))

      // Documentation for trace_attributes response:
      // https://mapzen.com/documentation/mobility/map-matching/api-reference/#outputs-of-trace_attributes
      // The response contains an `edges` property. Each `edge` may include
      // a `traffic_segments` property that correlates this edge with the OSMLR
      // segment. This property is unique to the routing service deployed for
      // OpenTraffic and is not part of the original Valhalla specification.
      response.edges.forEach(edge => {
        // It is possible for an edge not to have `traffic_segments`. These
        // are likely edges that are not routable or not meaningful in the
        // OpenTraffic system, or they are routes that have not yet been
        // parsed and given an OSMLR id.
        if (!edge.traffic_segments) return

        // For each segment in `traffic_segments`, record all segments in one
        // array, and segment ids in another array.
        edge.traffic_segments.forEach((segment) => {
          segments.push(segment)
          segmentIds.push(segment.segment_id)
        })
      })

      // We parse all segment ids for level, tile and segment indices, which
      // are used to build URLs for fetching data tiles. By looking at the
      // ids from the route segments, this allows us to fetch only the tiles
      // we need. (If we looked only at the bounding box of the route, we
      // would be downloading more tiles than we need to use.)
      // We also filter out duplicate suffixes to avoid downloading the same
      // tiles more than once.

      // OSMLR segments and Valhalla edges do not share a 1:1 relationship.
      // It is possible for a sequence of edges to share the same segment ID,
      // so there may be repetition in the array. First, remove all duplicate
      // segment IDs, then parse each one. Each ID is a mask of three numbers
      // that contain the tile level, tile index, and segment index. The
      // result is an array of objects [{ level, tile, segment }, ...].
      // Also, reject any segments at level 2; we won't have any data for those.
      const parsedIds = reject(uniq(segmentIds).map(parseSegmentId), obj => obj.level === 2)
      // Download all data tiles
      const date = {
        year: store.getState().date.year,
        week: store.getState().date.week
      }
      store.dispatch(clearBarchart())
      fetchDataTiles(parsedIds, date).then((tiles) => {
        let speedsForBarchart = []
        parsedIds.forEach((id) => {
          // Will add either measured or reference speed
          addSpeedToMapGeometry(tiles, date, id, id)
          speedsForBarchart = speedsForBarchart.concat(prepareSpeedsForBarChart(tiles, date, id))
        })
        store.dispatch(addSegmentsToBarchart(speedsForBarchart))

        // TODO: when year and week aren't specified, we should also
        // skip the step of trying to fetch data tiles
        if (date.year && date.week) {
          const routeTime = getRouteTime(response)
          store.dispatch(setTrafficRouteTime(routeTime))
        }

        // Now let's draw this
        const speeds = []
        const geojson = {
          type: 'FeatureCollection',
          features: [],
          properties: {
            analysisMode: 'route',
            analyisName: store.getState().app.viewName,
            date: store.getState().date,
            baselineTime: store.getState().route.baselineTime,
            trafficRouteTime: store.getState().route.trafficRouteTime
          }
        }

        response.edges.forEach(function (edge, index) {
          // Create individual segments for drawing, later.
          let id
          const begin = edge.begin_shape_index
          const end = edge.end_shape_index

          let coordsSlice = coordinates.slice(begin, end + 1)
          const fullArrayDist = Distance(coordsSlice[0], coordsSlice[coordsSlice.length - 1])
          console.log("Full Array TOTAL DISTANCE: ", fullArrayDist)
          let speed = -1
          for (let t = 0; t < edge.traffic_segments.length; t++) {
            id = edge.traffic_segments ? edge.traffic_segments[t].segment_id : null
            //there are multiple segments within an edge or there are segments crossing over multiple edges
            if (edge.traffic_segments.length > 1) {
              //set the index to the rounded begin percent of the coord array
              //calculate the distance for each coord pair and increment
              //once the distance exceeds the percentage of the end percent of the polyline, split the polyline
                const targetDist = fullArrayDist * edge.traffic_segments[t].end_percent
                console.log("Target distance is: ", targetDist)
                let total = 0
                for (let polyIdx = 0; polyIdx < coordsSlice.length; polyIdx++) {
                  //accumulate the distance
                  const prevTotal = dist
                  let dist = (polyIdx < coordsSlice.length-1) ? Distance(coordsSlice[polyIdx], coordsSlice[polyIdx+1]) : 0
                  total += dist
                  console.log("DISTANCE: ", dist)
                  console.log("TOTAL: ", total)

                  if (total > targetDist) {
                    const deltaToTarget = targetDist - prevTotal
                    console.log("Delta to target: ", deltaToTarget)
                    const percentAlong = deltaToTarget / dist
                    console.log("% along: ", percentAlong)
                    const newPoint = (polyIdx < coordsSlice.length-1) ? along_segment(coordsSlice[polyIdx],coordsSlice[polyIdx+1],percentAlong) : null
                    console.log("New segment pt: ", newPoint)
                    coordsSlice.splice(polyIdx+1, 0, [newPoint.lat, newPoint.lng])
                    let newcoords = coordsSlice.slice(0, polyIdx+2)
                    coordsSlice = coordsSlice.slice(newcoords.length-1, coordsSlice.length)
                    //reset
                    dist = 0
                    total = 0
                    console.log(newcoords)
                    console.log(coordsSlice)

                    for (let i = 0; i < parsedIds.length; i++) {
                      if (id === parsedIds[i].id) {
                        speed = parsedIds[i].speed
                        speeds.push({
                          coordinates: newcoords,
                          speed: speed,
                          properties: parsedIds[i]
                        })
                        break;
                      }
                    }
                    break;
                  }
                }
              }
            }
            for (let i = 0; i < parsedIds.length; i++) {
              if (id === parsedIds[i].id) {
                speed = parsedIds[i].speed
                speeds.push({
                  coordinates: coordsSlice,
                  speed: speed,
                  properties: parsedIds[i]
                })
                break;
              }
            }

            // Make geoJSON feature
            // coordinates in GeoJSON must flip lat/lng values
        /*    const coordsGeo = coordsSlice.map((i) => [i[1], i[0]])
            geojson.features.push({
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: coordsGeo
              },
              properties: {
                id: edge.traffic_segments[t],
                osmlr_id: edge.traffic_segments[t].segment_id,
                speed: speed
                // Note, this is missing properties that are already there in the region view
              }
            })*/
          })
          store.dispatch(setGeoJSON(geojson))
          store.dispatch(setRouteSegments(speeds))
          store.dispatch(stopLoading())
         })
         .catch((error) => {
           console.log('[fetchDataTiles error]', error)
           store.dispatch(hideLoading())
         })
       })
       .catch((error) => {
         console.log(error)
       })
}
