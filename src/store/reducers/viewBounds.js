import { SET_VIEW_BOUNDS, CLEAR_VIEW_BOUNDS } from '../actions'

const initialState = {
  bounds: null
}

const viewBounds = (state = initialState, action) => {
  switch (action.type) {
    case SET_VIEW_BOUNDS:
      return {
        ...state,
        bounds: action.bounds
      }
    case CLEAR_VIEW_BOUNDS:
      return {
        ...state,
        bounds: null
      }
    default:
      return state
  }
}

export default viewBounds
