import { reject, uniq } from 'lodash'
import polyline from '@mapbox/polyline'
import { getRoute, getTraceAttributes, valhallaResponseToPolylineCoordinates } from '../lib/valhalla'
import { parseSegmentId } from '../lib/tiles'
import { fetchDataTiles } from '../app/data'
import { startLoading, stopLoading, hideLoading } from '../store/actions/loading'
import { setMultiSegments, setRouteError, setRoute } from '../store/actions/route'
import store from '../store'

export function doRoutestuff (host, waypoints) {
  store.dispatch(startLoading())

  // Fetch route from Valhalla-based routing service, given waypoints.
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
      fetchDataTiles(parsedIds)
        .then((tiles) => {
          parsedIds.forEach(item => {
            // not all levels and tiles are available yet, so try()
            // skips it if it doesn't work
            try {
              const segmentId = item.segment
              const subtiles = tiles[item.level][item.tile] // object
              // find which subtile contains this segment id
              const subtileIds = Object.keys(subtiles)
              for (let i = 0, j = subtileIds.length; i < j; i++) {
                const tile = subtiles[subtileIds[i]]
                const upperBounds = (i === j - 1) ? tile.totalSegments : (tile.startSegmentIndex + tile.subtileSegments)
                // if this is the right tile, get the reference speed for the
                // current segment and attach it to the item.
                if (segmentId > tile.startSegmentIndex && segmentId <= upperBounds) {
                  // Test hour
                  const hour = 23
                  // Get the local id of the segment
                  // (eg. id 21000 is local id 1000 if tile segment size is 10000)
                  const subtileSegmentId = segmentId % tile.subtileSegments
                  // There is one array for every attribute. Divide unitSize by
                  // entrySize to know how many entries belong to each segment,
                  // and find the base index for that segment
                  const entryBaseIndex = subtileSegmentId * (tile.unitSize / tile.entrySize)
                  // Add the desired hour (0-index) to get the correct index value
                  const desiredIndex = entryBaseIndex + hour

                  // Append the data point to the return value for rendering later
                  item.speed = tile.speeds[desiredIndex]
                  break
                }
              }
            } catch (e) {}
          })

          // Now let's draw this
          const speeds = []
          response.edges.forEach(edge => {
            // Create individual segments for drawing, later.
            const begin = edge.begin_shape_index
            const end = edge.end_shape_index
            const coordsSlice = coordinates.slice(begin, end + 1)
            const id = edge.traffic_segments ? edge.traffic_segments[0].segment_id : null
            let found
            for (let i = 0, j = parsedIds.length; i < j; i++) {
              if (id === parsedIds[i].id) {
                found = parsedIds[i]
                break
              }
            }

            speeds.push({
              coordinates: coordsSlice,
              speed: found ? found.speed : null
            })
          })
          store.dispatch(setMultiSegments(speeds))
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
