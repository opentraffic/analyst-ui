import { CLEAR_BARCHART, ADD_SEGMENTS_TO_BARCHART } from '../actions'

const initialState = {
  speedsBinnedByHour: [],
  percentDiffsBinnedByHour: []
}

const barchart = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_BARCHART:
      return {
        ...state,
        speedsBinnedByHour: [],
        percentDiffsBinnedByHour: []
      }
    case ADD_SEGMENTS_TO_BARCHART:
      return {
        ...state,
        speedsBinnedByHour: action.speedsBinnedByHour,
        percentDiffsBinnedByHour: action.percentDiffsBinnedByHour
      }
    default:
      return state
  }
}

export default barchart
