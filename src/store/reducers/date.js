import moment from 'moment'
import {
  SET_DATE,
  SET_DATE_RANGE,
  CLEAR_DATE_RANGE,
  SET_DAY_FILTER,
  SET_HOUR_FILTER
} from '../actions'

const initialState = {
  // For date picker
  startDate: null,
  endDate: null,
  dateRange: {},

  // For time chart filters
  dayFilter: null,
  hourFilter: null
}

const date = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATE:
      const year = moment(action.startDate).year()
      const week = String(moment(action.startDate).week()).padStart(2, '0')
      return {
        ...state,
        startDate: action.startDate,
        endDate: action.endDate,
        year: year,
        week: week
      }
    case SET_DATE_RANGE:
      const startRange = moment(action.start)
      const endRange = moment(action.end)
      return {
        ...state,
        dateRange: {
          rangeStart: startRange,
          rangeEnd: endRange
        }
      }
    case CLEAR_DATE_RANGE:
      return {
        ...state,
        dateRange: {
          rangeStart: null,
          rangeENd: null
        }
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
