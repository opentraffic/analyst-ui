import L from 'leaflet'
import * as actionCreators from './store/actions'
import * as routeActionCreators from './store/reducers/route'
import store from './store'
import config from './config'
import { getQueryStringObject, updateURL, parseQueryString } from './lib/url-state'

// Initialize application based on url query string params
export function initApp (queryString = window.location.search) {
  // Parse URL to get all params
  const object = getQueryStringObject(queryString)
  const date = {
    startDate: Number(object.startDate) || null,
    endDate: Number(object.endDate) || null
  }
  const mapView = {
    lat: Number(object.lat) || config.map.center[0],
    lng: Number(object.lng) || config.map.center[1],
    zoom: Number(object.zoom) || config.map.zoom
  }
  const coordinates = [mapView.lat, mapView.lng]
  const label = object.label || ''

  // If no query string, just bare URL, update URL
  if (queryString.length === 0) {
    updateURL(mapView)
  }
  // Initializing lat/lng and zoom
  store.dispatch(actionCreators.recenterMap(coordinates, mapView.zoom))
  // Initializing map search bar
  store.dispatch(actionCreators.setLocation(coordinates, label))
  // Initializing dates
  store.dispatch(actionCreators.setDate(date.startDate, date.endDate))
  // Initializing markers and route
  initRoute(object)
}

export function initRoute (queryObject) {
  if (parseQueryString('waypoints') !== null) {
    // Split the string into array of latlng points
    const waypoints = queryObject.waypoints.split(',')
    for (var i = 0; i < waypoints.length; i++) {
      // Get the lat and lng for each waypoint
      const latlng = waypoints[i].split('/')
      // Initialize to leaflet latLng
      const point = L.latLng(
        Number(latlng[0]),
        Number(latlng[1])
      )
      // Add waypoint to route
      store.dispatch(routeActionCreators.addWaypoint(point))
    }
  }
}
