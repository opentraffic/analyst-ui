import { CLEAR_BARCHART, ADD_SEGMENTS_TO_BARCHART } from '../actions'

const initialState = {
  percentDiffsBinnedByHour: [],
  speedsBinnedByHour: [],
  refSpeedsBinnedByHour: []
}

const barchart = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_BARCHART:
      return {
        ...state,
        speedsBinnedByHour: [],
        percentDiffsBinnedByHour: [],
        refSpeedsBinnedByHour: []
      }
    case ADD_SEGMENTS_TO_BARCHART:
      return {
        ...state,
        speedsBinnedByHour: action.speedsBinnedByHour,
        percentDiffsBinnedByHour: action.percentDiffsBinnedByHour,
        refSpeedsBinnedByHour: action.refSpeedsBinnedByHour
      }
    default:
      return state
  }
}

export default barchart
