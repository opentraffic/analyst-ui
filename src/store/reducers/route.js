// Experimental: try Ducks (https://github.com/erikras/ducks-modular-redux)

// Actions
const SET_WAYPOINT = 'analyst-ui/route/SET_WAYPOINT'
const REMOVE_WAYPOINT = 'analyst-ui/route/REMOVE_WAYPOINT'
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
    case SET_WAYPOINT:
      return {
        ...state,
        waypoints: [...state.waypoints, action.waypoint]
      }
    case REMOVE_WAYPOINT:
      return {
        ...state,
        waypoints: state.waypoints.filter(waypoint => waypoint !== action.waypoint)
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
export function setWaypoint (waypoint) {
  return {
    type: SET_WAYPOINT,
    waypoint
  }
}

export function removeWaypoint (waypoint) {
  return {
    type: REMOVE_WAYPOINT,
    waypoint
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
