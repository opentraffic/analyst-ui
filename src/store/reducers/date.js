import {
  SET_DATE,
  TOGGLE_TIME_FILTERS,
  SET_DAY_FILTER,
  SET_HOUR_FILTER
} from '../actions'

const initialState = {
  // For date picker
  startDate: null,
  endDate: null,

  // For time chart filters
  filtersEnabled: false,
  dayFilter: null,
  hourFilter: null
}

const date = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATE:
      return {
        ...state,
        startDate: action.startDate,
        endDate: action.endDate
      }
    case TOGGLE_TIME_FILTERS:
      return {
        ...state,
        filtersEnabled: action.filtersEnabled || !state.filtersEnabled
      }
    case SET_DAY_FILTER:
      return {
        ...state,
        dayFilter: action.dayFilter
      }
    case SET_HOUR_FILTER:
      return {
        ...state,
        hourFilter: action.hourFilter
      }
    default:
      return state
  }
}

export default date
