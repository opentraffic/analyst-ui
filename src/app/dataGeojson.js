import L from 'leaflet'
import config from '../config'
import store from '../store'
import { recenterMap } from '../store/actions/map'
import { setDateRange } from '../store/actions/date'

const DATA_GEOJSON_URL = config.dataGeojson

export function setDataGeojson () {
  window.fetch(DATA_GEOJSON_URL)
    .then(response => response.json())
    .then(results => {
      const coverage = L.geoJSON(results, {
        style: function (feature) {
          return {color: feature.properties.color}
        },
        onEachFeature: function (feature, layer) {
          layer.on({ click: featureClicked })
        }
      })
      window.dataGeojson = coverage
      coverage.addTo(window.map)
    })
}

function featureClicked (event) {
  const latlng = [event.latlng.lat, event.latlng.lng]
  store.dispatch(recenterMap(latlng, 10))
  const { rangeStartDate, rangeEndDate } = event.target.feature.properties
  store.dispatch(setDateRange(rangeStartDate, rangeEndDate))
}
