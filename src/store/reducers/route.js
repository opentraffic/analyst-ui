import { isEqual } from 'lodash'
import {
  ADD_ROUTE_WAYPOINT,
  REMOVE_ROUTE_WAYPOINT,
  UPDATE_ROUTE_WAYPOINT,
  INSERT_ROUTE_WAYPOINT,
  SET_ROUTE,
  SET_ROUTE_ERROR,
  SET_MULTI_SEGMENTS,
  CLEAR_ANALYSIS
} from '../actions'

const initialState = {
  waypoints: [],
  lineCoordinates: [],
  multiSegments: [],
  error: null
}

const route = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ROUTE_WAYPOINT:
      return {
        ...state,
        waypoints: [...state.waypoints, action.waypoint]
      }
    case REMOVE_ROUTE_WAYPOINT:
      return {
        ...state,
        waypoints: state.waypoints.filter(waypoint => waypoint !== action.waypoint)
      }
    case UPDATE_ROUTE_WAYPOINT: {
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
    case INSERT_ROUTE_WAYPOINT:
      return {
        ...state,
        waypoints: [
          ...state.waypoints.slice(0, action.index),
          action.waypoint,
          ...state.waypoints.slice(action.index)
        ]
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
    case SET_MULTI_SEGMENTS:
      return {
        ...state,
        multiSegments: action.multiSegments,
        error: null
      }
    case CLEAR_ANALYSIS:
      return initialState
    default:
      return state
  }
}

export default route
