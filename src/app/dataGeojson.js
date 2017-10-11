import L from 'leaflet'
import store from '../store'
import config from '../config'
import { parseQueryString } from '../lib/url-state'
import { recenterMap } from '../store/actions/map'
import { setDateRange, clearDateRange } from '../store/actions/date'
import { setDataGeoJSON } from '../store/actions/data'

const DATA_GEOJSON_URL = config.dataGeojson
const LINE_OVERLAP_BUFFER = 0.005

/**
 * Gets data availability geojson and if no selected region or route on load,
 * adds geojson layer to map and event listener to recenter map when feature clicked
 *
 * Also stores data availability geojson in Redux for later use
 *
 */
export function setDataCoverage () {
  window.fetch(DATA_GEOJSON_URL)
    .then(response => response.json())
    .then(results => {
      store.dispatch(setDataGeoJSON(results))
      const coverage = L.geoJSON(results, {
        style: function (feature) {
          return {color: feature.properties.color}
        },
        onEachFeature: function (feature, layer) {
          layer.on({ click: featureClicked })
        }
      })
      window.dataCoverage = coverage
      if (parseQueryString('waypoints') === null &&
          parseQueryString('rw') === null) {
        coverage.addTo(window.map)
      }
    })
}

function featureClicked (event) {
  const latlng = [event.latlng.lat, event.latlng.lng]
  store.dispatch(recenterMap(latlng, 10))
}

/**
 * Goes through data availability geojson to see which feature the route or region is in.
 * Once feature is found, gets date range available and stores it in Redux.
 * If no feature is found, clears date range in Redux.
 *
 * Date picker is connected to Redux store and will have info panel 
 * stating what dates are available for that route or region.
 * If no feature is found, info panel does not state anything.
 *
 * @param {Object} northEast - latitude and longitude of northeast point of region/route
 * @param {Object} southWest - latitude and longitude of southeast point of region/route
 * 
 */
export function getDateRange (northEast, southWest) {
  const features = store.getState().data.dataGeoJSON.features
  let found = false

  for (let i = 0; i < features.length; i++) {
    const coordinates = features[i].geometry.coordinates[0]
    const northEastTile = {
      lat: coordinates[2][1],
      lng: coordinates[2][0]
    }
    const southWestTile = {
      lat: coordinates[0][1],
      lng: coordinates[0][0]
    }
    if (northEast.lat < northEastTile.lat + LINE_OVERLAP_BUFFER &&
        northEast.lng < northEastTile.lng + LINE_OVERLAP_BUFFER &&
        southWest.lat > southWestTile.lat - LINE_OVERLAP_BUFFER &&
        southWest.lng > southWestTile.lng - LINE_OVERLAP_BUFFER) {
      const { rangeStartDate, rangeEndDate } = features[i].properties
      store.dispatch(setDateRange(rangeStartDate, rangeEndDate))
      found = true
      break
    }
  }
  if (!found) { store.dispatch(clearDateRange()) }
}
