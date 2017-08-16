import { getTilesForBbox, getTileUrlSuffix } from '../lib/tiles'
import { getRoute } from '../lib/valhalla'
import { merge } from '../lib/geojson'
import { fetchDataTiles } from './data'
import L from 'leaflet'
import { uniq } from 'lodash'
import { parseSegmentId } from '../lib/tiles'
import store from '../store'

const OSMLR_TILE_PATH = 'https://osmlr-tiles.s3.amazonaws.com/v0.1/geojson/'
//const STATIC_DATA_TILE_PATH = 'https://s3.amazonaws.com/speed-extracts/2017/0/'
const host = 'routing-prod.opentraffic.io'

export function showRegion (bounds) {
  // First, convert bounds to waypoints
  // This way we can get the routes and bounding box from valhalla
  const waypoints = [L.latLng(bounds.south, bounds.west), L.latLng(bounds.north, bounds.east)]
  // Go get route using Valhalla
  getRoute(host, waypoints)
    // After getting route, get the bounding box and the relevant tiles from box
    .then((response) => {
      const bbox = response.trip.summary
      const tiles = getTilesForBbox(bbox.min_lon, bbox.min_lat, bbox.max_lon, bbox.max_lat)
      // Filter out tiles with level 2, no data for those
      const downloadTiles = tiles.filter(function(tile) { return tile[0] !== 2 })
      // Get suffixes of these tiles
      const suffixes = downloadTiles.map(i => getTileUrlSuffix(i))
      return suffixes
    })
    // Second, fetch the OSMLR Geometry tiles using the suffixes
    .then(fetchOSMLRGeometryTiles)
    // Third, get segment IDs to use later
    .then((results) => {
      const features = results.features
      const segmentIds = features.map(key => {
        return key.properties.osmlr_id
      })
      const parsedIds = uniq(segmentIds).map(parseSegmentId)
      return parsedIds
    })
    // Using segmentIds, fetch data tiles
    .then((parsedIds) => {
      fetchDataTiles(parsedIds)
        .then((tiles) => {
          parsedIds.forEach(item => {
            const segmentId = item.segment
            const subtiles = tiles[item.level][item.tile]
            const subtileIds = Object.keys(subtiles)
            for (let i = 0, j = subtileIds.length; i < j; i++) {
              const tile = subtiles[subtileIds[i]]
              const upperBounds = (i === j - 1) ? tile.totalSegments : (tile.startSegmentIndex + tile.subtileSegments)
              // if this is the right tile, get the reference speed for the
              // current segment and attach it to the item.
              if (segmentId > tile.startSegmentIndex && segmentId <= upperBounds) {
                // Test hour
                const hour = store.getState().app.tempHour
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
          })
        })
    })
}


/**
 * Fetch requested OSMLR geometry tiles and return its result as a
 * single GeoJSON file.
 *
 * @param {Array<String>} suffixes - an array of tile path suffixes,
 *            in the form of `x/xxx/xxx`.
 * @return {Promise} - a Promise is returned passing the value of all
 *            OSMLR geometry tiles, merged into a single GeoJSON.
 */
function fetchOSMLRGeometryTiles (suffixes) {
  const urls = suffixes.map(suffix => `${OSMLR_TILE_PATH}${suffix}.json`)
  const fetchTiles = urls.map(url => fetch(url).then(res => res.json()))
  // Results is an array of all GeoJSON tiles. Next, merge into one file
  // and return the result as a single GeoJSON.
  return Promise.all(fetchTiles).then(merge)
}

