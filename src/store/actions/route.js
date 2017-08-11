import {
  ADD_ROUTE_WAYPOINT,
  REMOVE_ROUTE_WAYPOINT,
  UPDATE_ROUTE_WAYPOINT,
  INSERT_ROUTE_WAYPOINT,
  SET_ROUTE,
  SET_ROUTE_ERROR,
  SET_MULTI_SEGMENTS
} from '../actions'

export function addWaypoint (waypoint) {
  return {
    type: ADD_ROUTE_WAYPOINT,
    waypoint
  }
}

export function removeWaypoint (waypoint) {
  return {
    type: REMOVE_ROUTE_WAYPOINT,
    waypoint
  }
}

export function updateWaypoint (oldWaypoint, newWaypoint) {
  return {
    type: UPDATE_ROUTE_WAYPOINT,
    oldWaypoint,
    newWaypoint
  }
}

export function insertWaypoint (waypoint, insertAfter) {
  return {
    type: INSERT_ROUTE_WAYPOINT,
    waypoint,
    index: insertAfter + 1
  }
}

export function setRoute (latlngs) {
  return {
    type: SET_ROUTE,
    lineCoordinates: latlngs
  }
}

export function clearRoute () {
  return {
    type: SET_ROUTE,
    lineCoordinates: []
  }
}

export function setRouteError (message) {
  return {
    type: SET_ROUTE_ERROR,
    error: message
  }
}

export function clearRouteError () {
  return {
    type: SET_ROUTE_ERROR,
    error: null
  }
}

export function setMultiSegments (segments) {
  return {
    type: SET_MULTI_SEGMENTS,
    multiSegments: segments
  }
}
