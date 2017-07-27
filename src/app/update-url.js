import store from '../store'
import { updateURL } from '../lib/url-state'

export function initUrlUpdate () {
  store.subscribe(() => {
    const state = store.getState()

    updateURL({
      waypoints: getRouteWaypoints(state.route)
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
