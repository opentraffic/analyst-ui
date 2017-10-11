import { SET_DATA_GEOJSON } from '../actions'

export function setDataGeoJSON (geo) {
  return {
    type: SET_DATA_GEOJSON,
    geo
  }
}
