import { isEqual } from 'lodash'

// Experimental: try Ducks (https://github.com/erikras/ducks-modular-redux)

// Actions
const ADD_WAYPOINT = 'analyst-ui/route/ADD_WAYPOINT'
const REMOVE_WAYPOINT = 'analyst-ui/route/REMOVE_WAYPOINT'
const UPDATE_WAYPOINT = 'analyst-ui/route/UPDATE_WAYPOINT'
const SET_ROUTE = 'analyst-ui/route/SET_ROUTE'
const SET_ROUTE_ERROR = 'analyst-ui/route/SET_ROUTE_ERROR'
const RESET = 'analyst-ui/route/RESET'

// Reducer
const initialState = {
  waypoints: [],
  lineCoordinates: [],
  error: null
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case ADD_WAYPOINT:
      return {
        ...state,
        waypoints: [...state.waypoints, action.waypoint]
      }
    case REMOVE_WAYPOINT:
      return {
        ...state,
        waypoints: state.waypoints.filter(waypoint => waypoint !== action.waypoint)
      }
    case UPDATE_WAYPOINT: {
      const copy = [...state.waypoints]
      for (let i = 0; i < copy.length; i++) {
        if (isEqual(copy[i], action.oldWaypoint)) {
          copy[i] = action.newWaypoint
          break
        }
      }
      return {
        ...state,
        waypoints: copy
      }
    }
    case SET_ROUTE:
      return {
        ...state,
        lineCoordinates: action.lineCoordinates,
        error: null
      }
    case SET_ROUTE_ERROR:
      return {
        ...state,
        lineCoordinates: [],
        error: action.error
      }
    case RESET:
      return initialState
    default:
      return state
  }
}

// Action creators
export function addWaypoint (waypoint) {
  return {
    type: ADD_WAYPOINT,
    waypoint
  }
}

export function removeWaypoint (waypoint) {
  return {
    type: REMOVE_WAYPOINT,
    waypoint
  }
}

export function updateWaypoint (oldWaypoint, newWaypoint) {
  return {
    type: UPDATE_WAYPOINT,
    oldWaypoint,
    newWaypoint
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

export function resetRoute () {
  return { type: RESET }
}

// Thunks
