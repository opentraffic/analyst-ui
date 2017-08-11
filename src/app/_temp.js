/* eslint-disable */
import { getTilesForBbox, getTileUrlSuffix, parseSegmentId } from '../lib/tiles'
import { merge } from '../lib/geojson'
import { setDataSource } from '../lib/tangram'

const OSMLR_TILE_PATH = 'https://osmlr-tiles.s3.amazonaws.com/v0.1/geojson/'

// Download tiles based on bounding box.

// Using the bounding box of the route, determine which OSMLR
// geometry tiles we need
const bounds = response.trip.summary
const tiles = getTilesForBbox(bounds.min_lon, bounds.min_lat, bounds.max_lon, bounds.max_lat)

// For now, reject tiles at level 2, which don't exist at the moment.
const downloadTiles = reject(tiles, (i) => i[0] === 2)

// Create full URLs.
const tileUrls = downloadTiles.map(i => `${STATIC_DATA_TILE_PATH}${getTileUrlSuffix(i)}.spd.0.gz`)
console.log(tileUrls)
// const promises = tileUrls.map(url => fetch(url)
//   .then(res => res.json())
//   .catch(e => console.log(e)))
//
// Promise.all(promises).then(results => {
//   console.log(results)
// })

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

// Fetch all OSMLR geometry tiles.
// Remove all duplicate suffixes first so that we don't make more requests
// than we need. Memory management is important here. More than a certain
// number of tiles and we'll run out of memory.
fetchOSMLRGeometryTiles(suffixes).then((geo) => {
  setDataSource('routes', { type: 'GeoJSON', data: geo })

  // lets see if we can find the segmentId as osmlr_id
  const features = geo.features
  let found = false
  for (let i = 0, j = features.length; i < j; i++) {
    // This property is a number, not a string
    if (features[i].properties.osmlr_id === 849766009720) {
      console.log(features[i])
      found = true
      break
    }
  }
  if (found === false) {
    console.log('not found')
  }
})
