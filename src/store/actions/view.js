import { SET_VIEW_BOUNDS, CLEAR_VIEW_BOUNDS, SET_GEOJSON } from '../actions'

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

export function setGeoJSON (geo) {
  return {
    type: SET_GEOJSON,
    geoJSON: geo
  }
}
