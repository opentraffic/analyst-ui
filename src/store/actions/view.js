import { SET_VIEW_BOUNDS, CLEAR_VIEW_BOUNDS, SET_GEOJSON, SET_DATA_GEOJSON } from '../actions'

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

export function setDataGeoJSON (geo) {
  return {
    type: SET_DATA_GEOJSON,
    dataGeoJSON: geo
  }
}
