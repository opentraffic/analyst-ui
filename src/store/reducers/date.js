import { SET_DATE } from '../actions'

const initialState = {
  startDate: null,
  endDate: null
}

const date = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATE:
      return {
        ...state,
        startDate: action.startDate,
        endDate: action.endDate
      }
    default:
      return state
  }
}

export default date
