import {
  SET_DATE,
  TOGGLE_TIME_FILTERS,
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

export function toggleTimeFilters () {
  return {
    type: TOGGLE_TIME_FILTERS
  }
}

export function enableTimeFilters () {
  return {
    type: TOGGLE_TIME_FILTERS,
    filtersEnabled: true
  }
}

export function disableTimeFilters () {
  return {
    type: TOGGLE_TIME_FILTERS,
    filtersEnabled: false
  }
}

export function setDayFilter (filter) {
  return {
    type: SET_DAY_FILTER,
    dayFilter: filter
  }
}

export function setHourFilter (filter) {
  return {
    type: SET_HOUR_FILTER,
    hourFilter: filter
  }
}
