import { uniq } from 'lodash'
import { getTilesForBbox, getTileUrlSuffix, parseSegmentId } from '../lib/tiles'
import { merge } from '../lib/geojson'
import { setDataSource, getCurrentScene, setCurrentScene } from '../lib/tangram'
import { fetchDataTiles } from './data'
import { addSpeedToMapGeometry, prepareSpeedsForBarChart } from './processing'
import store from '../store'
import { setGeoJSON } from '../store/actions/view'
import { startLoading, stopLoading, hideLoading } from '../store/actions/loading'
import { clearBarchart, setBarchartSpeeds } from '../store/actions/barchart'
import { setRouteError } from '../store/actions/route'
import { displayRegionInfo } from './route-info'
import mathjs from 'mathjs'

const LINE_OVERLAP_BUFFER = 0.0003
const MAX_AREA_BBOX = 0.01

const OSMLRCache = {}

function getSuffixes (bbox) {
  const tiles = getTilesForBbox(bbox.min_lon, bbox.min_lat, bbox.max_lon, bbox.max_lat)
  // Filter out tiles with level 2, no data for those
  const downloadTiles = tiles.filter(function (tile) { return tile[0] !== 2 })
  // Get suffixes of these tiles
  const suffixes = downloadTiles.map(i => getTileUrlSuffix(i))
  return suffixes
}

/**
 * Goes through each coordinate, each line, each point, and removes (in place)
 * latlngs that are outside bounding box
 * It then removes array of points if empty, array of lines if empty, array of coordinates if empty,
 * and finally, if that feature has no coordinates, it removes the feature from the array of features
 *
 * @param {array} features - geojson from OSMLR geometry tile
 * @param {object} bounds - the latlngs of the bounding box
 * @returns {array} - features that are within the bounding box
*/

function withinBbox (features, bounds) {
  // We need to check the geometry.coordinates to check if they're within bounds
  // If not within bound, remove entire feature from features
  const coordinates = features.map(feature => {
    return feature.geometry.coordinates
  })

  // Coordinates have array of lines
  // Lines have array of points [lng, lat]
  for (let lineIndex = coordinates.length - 1; lineIndex >= 0; lineIndex--) {
    const line = coordinates[lineIndex]
    for (let pointsIndex = line.length - 1; pointsIndex >= 0; pointsIndex--) {
      const point = line[pointsIndex]
      const lat = point[1]
      const lng = point[0]
      // Checking if latlng is within bounding box
      // If not remove from points
      if (lng < Number(bounds.west) - LINE_OVERLAP_BUFFER || lng > Number(bounds.east) + LINE_OVERLAP_BUFFER || lat < Number(bounds.south) - LINE_OVERLAP_BUFFER || lat > Number(bounds.north) + LINE_OVERLAP_BUFFER) {
        line.splice(pointsIndex, 1)
      }
    }
    // If no lines in coordinates, remove from coordinates
    if (line.length === 0) { coordinates.splice(lineIndex, 1) }
  }
  // If no coordinates, remove entire feature from array of features
  for (let i = features.length - 1; i >= 0; i--) {
    const feature = features[i]
    if (feature.geometry.coordinates.length === 0) { features.splice(i, 1) }
  }
  return features
}

export function getBboxArea (bounds) {
  const width = Math.abs(bounds.east - bounds.west)
  const height = Math.abs(bounds.north - bounds.south)
  const area = width * height
  return area
}

export function clearRegion () {
  const scene = getCurrentScene()
  delete scene.sources.routes
  setCurrentScene(scene)
  window.tangramLayer.setSelectionEvents({hover: null})
}

export function showRegion (bounds) {
  // If bounds are cleared, remove data source from tangram
  if (!bounds) {
    clearRegion()
    return
  }

  store.dispatch(startLoading())

  // If area of bounding box exceeds max_area, display error
  const area = getBboxArea(bounds)
  if (area > MAX_AREA_BBOX) {
    const message = 'Please zoom in and reduce the size of your bounding box'
    store.dispatch(setRouteError(message))
    store.dispatch(hideLoading())
    return
  }

  const bbox = {
    min_lon: Number(bounds.west),
    min_lat: Number(bounds.south),
    max_lon: Number(bounds.east),
    max_lat: Number(bounds.north)
  }
  const suffixes = getSuffixes(bbox)

  // Fetch the OSMLR Geometry tiles using the suffixes
  fetchOSMLRGeometryTiles(suffixes)
    .then((results) => {
      const copy = JSON.parse(JSON.stringify(results))
      const features = copy.features
      // Remove from geojson, routes outside bounding box (bounds)
      const regionFeatures = withinBbox(features, bounds)
      results.features = regionFeatures

      // Get segment IDs to use later
      const segmentIds = features.map(key => {
        return key.properties.osmlr_id
      })
      // Removing duplicates of segment IDs
      const parsedIds = uniq(segmentIds).map(parseSegmentId)
      // Using segmentIds, fetch data tiles
      const date = {
        year: store.getState().date.year,
        week: store.getState().date.week
      }
      store.dispatch(clearBarchart())
      fetchDataTiles(parsedIds, date)
        .then((tiles) => {
          if (date.year && date.week) {
            let totalSpeedArray = mathjs.zeros(7, 24)
            let totalCountArray = mathjs.zeros(7, 24)
            parsedIds.forEach((id, index) => {
              addSpeedToMapGeometry(tiles, date, id, features[index].properties)
              let speedsFromThisSegment = prepareSpeedsForBarChart(tiles, date, id)
              totalSpeedArray = mathjs.add(totalSpeedArray, speedsFromThisSegment.speeds)
              totalCountArray = mathjs.add(totalCountArray, speedsFromThisSegment.counts)
            })
            store.dispatch(setBarchartSpeeds(totalSpeedArray, totalCountArray))
          }
          setDataSource('routes', { type: 'GeoJSON', data: results })
          results.properties = {
            analysisMode: 'region',
            analyisName: store.getState().app.viewName,
            bounds: store.getState().view.bounds,
            date: store.getState().date
          }

          window.tangramLayer.setSelectionEvents({
            hover: function (selection) { displayRegionInfo(selection) }
          })

          store.dispatch(setGeoJSON(results))
          store.dispatch(stopLoading())
        })
    })
    .catch((error) => {
      console.log('[fetchDataTiles error]', error)
      store.dispatch(hideLoading())
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
  const tiles = suffixes.map(suffix => fetchOSMLRtile(suffix))
  return Promise.all(tiles).then(merge)
}

function fetchOSMLRtile (suffix) {
  // If tile already exists in cache, return a copy of it
  if (OSMLRCache[suffix]) {
    const clone = JSON.parse(JSON.stringify(OSMLRCache[suffix]))
    return clone
  }
  // Otherwise make a request for it, cache it and return tile
  const path = store.getState().config.osmlrTileUrl
  const url = `${path}${suffix}.json`
  return window.fetch(url)
    .then(results => results.json())
    .then(res => cacheOSMLRTiles(res, suffix))
}

function cacheOSMLRTiles (tile, index) {
  Object.assign(OSMLRCache, {[index]: tile})
  return tile
}
