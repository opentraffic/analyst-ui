import store from '../store'
import { updateURL } from '../lib/url-state'

export function initUrlUpdate () {
  store.subscribe(() => {
    const state = store.getState()

    updateURL({
      waypoints: getRouteWaypoints(state.route),
      ...getRegionBounds(state.viewBounds.bounds),
      ...getDateRange(state.date),
      ...getMapView(state.map),
      label: getMapLabel(state.map)
    })
  })
}

function getRouteWaypoints (route) {
  const waypoints = route.waypoints
  const numOfPoints = waypoints.length
  let values = []

  if (numOfPoints > 0) {
    for (var i = 0; i < numOfPoints; i++) {
      const lat = waypoints[i].lat.toFixed(4)
      const lng = waypoints[i].lng.toFixed(4)
      const latlng = lat + '/' + lng
      // Push latlng point to array of waypoints
      values.push(latlng)
    }
  } else { // If points all removed
    // Remove waypoints from url query string
    values = null
  }

  return values
}

function getRegionBounds (bounds) {
  return {
    rn: (bounds && bounds.north) || null,
    rs: (bounds && bounds.south) || null,
    re: (bounds && bounds.east) || null,
    rw: (bounds && bounds.west) || null
  }
}

function getDateRange (date) {
  return {
    startDate: (date && date.startDate) || null,
    endDate: (date && date.endDate) || null
  }
}

function getMapView (map) {
  if (!(map && Array.isArray(map.coordinates) && map.zoom)) return null

  return {
    lat: map.coordinates[0].toFixed(4),
    lng: map.coordinates[1].toFixed(4),
    zoom: map.zoom.toFixed(4)
  }
}

function getMapLabel (map) {
  return (map && map.label) || null
}
