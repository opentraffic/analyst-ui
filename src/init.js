import L from 'leaflet'
import config from './config'
import store from './store'
import { recenterMap, setLocation } from './store/actions/map'
import { setDate, setDayFilter, setHourFilter, setDateRange } from './store/actions/date'
import { addWaypoint } from './store/actions/route'
import { updateScene } from './store/actions/tangram'
import { setBounds } from './store/actions/view'
import { setRegionAnalysisMode, setRouteAnalysisMode, setAnalysisName, setRefSpeedComparisonEnabled, setRefSpeedEnabled } from './store/actions/app'
import { initUrlUpdate } from './app/update-url'
import { initDocTitle } from './app/doc-title'
import { getInitialTangramScene } from './app/tangram-scene'
import { setDataCoverage } from './app/dataGeojson'
import { getQueryStringObject, updateURL } from './lib/url-state'

const VALUE_DELIMITER = '/'

// Initialize application based on url query string params
export function initApp (queryString = window.location.search) {
  // Initialize data availability geojson and save to store
  setDataCoverage(config.dataGeojson)

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
  store.dispatch(recenterMap(coordinates, mapView.zoom))
  // Initializing map search bar
  store.dispatch(setLocation(coordinates, label))
  // Initializing dates
  store.dispatch(setDate(date.startDate, date.endDate))

  // Initialize time/day filters if present
  if (object.df) {
    const dayFilter = object.df.split(VALUE_DELIMITER)
    store.dispatch(setDayFilter(dayFilter))
  }
  if (object.hf) {
    const hourFilter = object.hf.split(VALUE_DELIMITER)
    store.dispatch(setHourFilter(hourFilter))
  }

  // Initializing analysis view name
  if (object.name) {
    const viewName = object.name
    store.dispatch(setAnalysisName(viewName))
  }

  // Initialize reference speed comparison mode
  store.dispatch(setRefSpeedComparisonEnabled((object.refSpeed === 'true')))

  store.dispatch(setRefSpeedEnabled((object.ref === 'true')))

  // Initializing markers and route, or view bounds.
  // Existence of markers will override existence of bounds.
  if (object.waypoints) {
    initRoute(object.waypoints)
  } else if (object.rw && object.rs && object.re && object.rn) {
    // All bounds must be present to be valid, otherwise it's discarded.
    initBounds(object.rw, object.rs, object.re, object.rn)
  }

  if (object.rangeStart && object.rangeEnd) {
    const rangeStart = Number(object.rangeStart)
    const rangeEnd = Number(object.rangeEnd)
    store.dispatch(setDateRange(rangeStart, rangeEnd))
  }

  // Initialize Tangram scene file
  const scene = getInitialTangramScene()
  if (object.refSpeed === 'true') scene.global.refSpeedComparisonEnabled = true
  if (object.ref === 'true') scene.global.refSpeedEnabled = true
  store.dispatch(updateScene(getInitialTangramScene()))

  // Listen for updates to store, which updates the URL
  initUrlUpdate()
  initDocTitle()
}

function initRoute (value) {
  // Split the string into array of latlng points
  const waypoints = value.split(',')
  for (var i = 0; i < waypoints.length; i++) {
    // Get the lat and lng for each waypoint
    const latlng = waypoints[i].split(VALUE_DELIMITER)
    // Initialize to leaflet latLng
    const point = L.latLng(
      Number(latlng[0]),
      Number(latlng[1])
    )
    // Add waypoint to route
    store.dispatch(addWaypoint(point))
  }
  store.dispatch(setRouteAnalysisMode())
}

function initBounds (west, south, east, north) {
  store.dispatch(setBounds({ north, south, east, west }))
  store.dispatch(setRegionAnalysisMode())
}
