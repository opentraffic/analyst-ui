import { SET_VIEW_BOUNDS, CLEAR_VIEW_BOUNDS } from '../actions'

export function setBounds (bounds) {
  return {
    type: SET_VIEW_BOUNDS,
    bounds
  }
}

export function clearBounds () {
  return {
    type: CLEAR_VIEW_BOUNDS
  }
}
