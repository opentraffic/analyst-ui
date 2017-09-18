import { reject, uniq } from 'lodash'
import polyline from '@mapbox/polyline'
import { getRoute, getTraceAttributes, valhallaResponseToPolylineCoordinates } from '../lib/valhalla'
import { parseSegmentId, getTileUrlSuffix, getSegmentIndexFromSegmentId } from '../lib/tiles'
import { fetchDataTiles, fetchHistoricSpeedTile, fetchReferenceSpeedTile } from './data'
import { addSpeedToThing } from './processing'
import { startLoading, stopLoading, hideLoading } from '../store/actions/loading'
import { clearMultiSegments, setMultiSegments, setRouteError, setRoute, clearRoute, clearRouteError } from '../store/actions/route'
import store from '../store'

function resetRouteState () {
  store.dispatch(clearRoute())
  store.dispatch(clearRouteError())
  store.dispatch(clearMultiSegments())
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
      let hist = null;
      let ref = null;
      fetchDataTiles(parsedIds).then((tiles) => {
        parsedIds.forEach((item) => {
          addSpeedToThing(tiles, item, item)
          const tileid = { level: item.level, tile: item.tile }
          const suffix = getTileUrlSuffix(tileid)

        // Now let's draw this
        const speeds = []
        response.edges.forEach(function(edge, index) {
          // Create individual segments for drawing, later.
          const begin = edge.begin_shape_index
          const end = edge.end_shape_index
          const coordsSlice = coordinates.slice(begin, end + 1)
          const id = edge.traffic_segments ? edge.traffic_segments[0].segment_id : null
          const segmentIdx = getSegmentIndexFromSegmentId(id) ? id != null : -1
          const elapsedTime = response.edges[index+1] < response.edges.length ? response.edges[index+1].end_node.elapsed_time - edge.end_node.elapsed_time : null
          /*
          let found
          for (let i = 0, j = parsedIds.length; i < j; i++) {
            if (id === parsedIds[i].id) {
              found = parsedIds[i]
              break
            }
          }*/
          if (item != null) {
            fetchHistoricSpeedTile(suffix).then((hist) => {
              console.log('historic speed tile', hist.speeds[item.segment])
            })
            fetchReferenceSpeedTile(suffix).then((ref) => {
              console.log('ref speed tile', ref.referenceSpeeds80[item.segment])
            })
            let speed = -1;
            if (hist !== null && hist.speeds[segmentIdx] !== -1) {
              speed = hist.speeds[segmentIdx]
              console.log('historic speed data is FOUND :: ' + speed + ' for segment id:: ' + id)
            } else if (ref != null && ref.referenceSpeeds80[segmentIdx] !== -1) {
              speed = ref.referenceSpeeds80[segmentIdx]
              console.log('No historic speed, using refspeed :: ' + speed + ' for segment id:: ' + id)
            } else {
              speed = elapsedTime
              console.log('No ref speed, using elapsed time :: ' + speed + ' for segment id:: ' + id)
            }

            speeds.push({
              coordinates: coordsSlice,
              speed: speed
            })
          }
        })
        store.dispatch(setMultiSegments(speeds))
        store.dispatch(stopLoading())
      })
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
