// Actions
const SET_BOUNDS = 'analyst-ui/viewBounds/SET_BOUNDS'
const CLEAR_BOUNDS = 'analyst-ui/viewBounds/CLEAR_BOUNDS'

// Reducer
const initialState = {
  bounds: null
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_BOUNDS:
      return {
        ...state,
        bounds: action.bounds
      }
    case CLEAR_BOUNDS:
      return {
        ...state,
        bounds: null
      }
    default:
      return state
  }
}

// Action creators
export function setBounds (bounds) {
  return {
    type: SET_BOUNDS,
    bounds
  }
}

export function clearBounds () {
  return { type: CLEAR_BOUNDS }
}
