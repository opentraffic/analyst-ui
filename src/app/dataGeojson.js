import L from 'leaflet'
import store from '../store'
import config from '../config'
import { parseQueryString } from '../lib/url-state'
import { recenterMap } from '../store/actions/map'
import { setDateRange, clearDateRange } from '../store/actions/date'
import { setDataGeoJSON } from '../store/actions/dataGeoJSON'

const DATA_GEOJSON_URL = config.dataGeojson

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

// geojson feature.geometry.coordinates are in lng, lat
export function getDateRange (query) {
  const northEast = query.getNorthEast()
  const southWest = query.getSouthWest()

  const features = store.getState().dataAvailability.dataGeoJSON.features
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
    if (northEast.lat < northEastTile.lat && northEast.lng < northEastTile.lng &&
        southWest.lat > southWestTile.lat && southWest.lng > southWestTile.lng) {
      const { rangeStartDate, rangeEndDate } = features[i].properties
      store.dispatch(setDateRange(rangeStartDate, rangeEndDate))
      found = true
      break
    }
  }
  if (!found) { store.dispatch(clearDateRange()) }
}
