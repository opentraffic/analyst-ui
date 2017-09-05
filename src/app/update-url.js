import store from '../store'
import { updateURL } from '../lib/url-state'

// Keep track of all named URL query parameters for this app.
const ROUTE_WAYPOINTS = 'waypoints'
const REGION_BOUNDS_NORTH = 'rn'
const REGION_BOUNDS_SOUTH = 'rs'
const REGION_BOUNDS_WEST = 'rw'
const REGION_BOUNDS_EAST = 're'
const DATE_START = 'startDate'
const DATE_END = 'endDate'
const DAY_FILTER = 'df'
const HOUR_FILTER = 'hf'
const MAP_LATITUDE = 'lat'
const MAP_LONGITUDE = 'lng'
const MAP_ZOOM = 'zoom'
const MAP_LABEL = 'label'
const ANALYSIS_NAME = 'name'

const VALUE_DELIMITER = '/'

export function initUrlUpdate () {
  store.subscribe(() => {
    const state = store.getState()

    updateURL({
      [ROUTE_WAYPOINTS]: getRouteWaypoints(state.route),
      ...getRegionBounds(state.viewBounds.bounds),
      ...getDateRange(state.date),
      ...getTimeFilters(state.date),
      ...getMapView(state.map),
      [MAP_LABEL]: getMapLabel(state.map),
      [ANALYSIS_NAME]: getAnalysisName(state.app)
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
      const latlng = lat + VALUE_DELIMITER + lng
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
    [REGION_BOUNDS_NORTH]: (bounds && bounds.north) || null,
    [REGION_BOUNDS_SOUTH]: (bounds && bounds.south) || null,
    [REGION_BOUNDS_EAST]: (bounds && bounds.east) || null,
    [REGION_BOUNDS_WEST]: (bounds && bounds.west) || null
  }
}

function getDateRange (date) {
  return {
    [DATE_START]: (date && date.startDate) || null,
    [DATE_END]: (date && date.endDate) || null
  }
}

export function getTimeFilters (date) {
  if (date.filtersEnabled) {
    let dayFilter
    let hourFilter

    if (date && date.dayFilter) {
      dayFilter = date.dayFilter[0] + VALUE_DELIMITER + date.dayFilter[1]
    }

    if (date && date.hourFilter) {
      hourFilter = date.hourFilter[0] + VALUE_DELIMITER + date.hourFilter[1]
    }

    return {
      [DAY_FILTER]: dayFilter || null,
      [HOUR_FILTER]: hourFilter || null
    }
  }

  return null
}

function getMapView (map) {
  if (!(map && Array.isArray(map.coordinates) && map.zoom)) return null

  return {
    [MAP_LATITUDE]: map.coordinates[0].toFixed(4),
    [MAP_LONGITUDE]: map.coordinates[1].toFixed(4),
    [MAP_ZOOM]: map.zoom.toFixed(4)
  }
}

function getMapLabel (map) {
  return (map && map.label) || null
}

function getAnalysisName (app) {
  return app.viewName !== '' ? app.viewName : null
}
