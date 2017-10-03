import { CLEAR_BARCHART, ADD_SEGMENTS_TO_BARCHART } from '../actions'

const initialState = {
  speedsBinnedByHour: []
}

const barchart = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_BARCHART:
      return {
        ...state,
        speedsBinnedByHour: []
      }
    case ADD_SEGMENTS_TO_BARCHART:
      return {
        ...state,
        speedsBinnedByHour: action.segments
      }
    default:
      return state
  }
}

export default barchart
