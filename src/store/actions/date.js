import {
  SET_DATE,
  SET_DATE_RANGE,
  CLEAR_DATE_RANGE,
  SET_DAY_FILTER,
  SET_HOUR_FILTER
} from '../actions'

export function setDate (startDate, endDate) {
  return {
    type: SET_DATE,
    startDate,
    endDate
  }
}

export function setDayFilter (filter) {
  return {
    type: SET_DAY_FILTER,

    // Cast values to number
    dayFilter: filter.map(i => Number(i))
  }
}

export function setHourFilter (filter) {
  return {
    type: SET_HOUR_FILTER,

    // Cast values to number
    hourFilter: filter.map(i => Number(i))
  }
}

export function setDateRange (start, end) {
  return {
    type: SET_DATE_RANGE,
    start,
    end
  }
}

export function clearDateRange () {
  return {
    type: CLEAR_DATE_RANGE
  }
}
