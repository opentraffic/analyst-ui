import L from 'leaflet'
import store from '../store'
import config from '../config'
import { recenterMap } from '../store/actions/map'
import { setDateRange } from '../store/actions/date'

export function setDataGeojson () {
  window.fetch(config.dataGeojson)
    .then(response => response.json())
    .then(results => {
      const coverage = L.geoJSON(results, {
        style: function (feature) {
          return {color: feature.properties.color}
        },
        onEachFeature: function (feature, layer) {
          layer.on({ click: featureClicked })
        }
      }).addTo(window.map)
      window.dataGeojson = coverage
    })
}

function featureClicked (event) {
  const latlng = [event.latlng.lat, event.latlng.lng]
  store.dispatch(recenterMap(latlng, 10))
  const { rangeStartDate, rangeEndDate } = event.target.feature.properties
  store.dispatch(setDateRange(rangeStartDate, rangeEndDate))
}
