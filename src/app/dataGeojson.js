import L from 'leaflet'
import store from '../store'
import config from '../config'
import { recenterMap } from '../store/actions/map'
import { setDateRange } from '../store/actions/date'
import { setDataGeoJSON } from '../store/actions/view'

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
      coverage.addTo(window.map)
    })
}

function featureClicked (event) {
  const latlng = [event.latlng.lat, event.latlng.lng]
  store.dispatch(recenterMap(latlng, 10))
  console.log(event.target.feature)
  const { rangeStartDate, rangeEndDate } = event.target.feature.properties
  store.dispatch(setDateRange(rangeStartDate, rangeEndDate))
}
