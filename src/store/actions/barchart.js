import { CLEAR_BARCHART, ADD_SEGMENTS_TO_BARCHART } from '../actions'

export function clearBarchart () {
  return {
    type: CLEAR_BARCHART
  }
}

export function addSegmentsToBarchart (segments) {
  return {
    type: ADD_SEGMENTS_TO_BARCHART,
    segments: segments
  }
}
