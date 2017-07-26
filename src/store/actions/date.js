import { SET_DATE } from '../actions'

export function setDate (startDate, endDate) {
  return {
    type: SET_DATE,
    startDate,
    endDate
  }
}
