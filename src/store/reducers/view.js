import { SET_VIEW_BOUNDS, SET_GEOJSON, SET_DATA_GEOJSON, CLEAR_VIEW_BOUNDS, CLEAR_ANALYSIS } from '../actions'

const initialState = {
  bounds: null,
  geoJSON: null,
  dataGeoJSON: null
}

const view = (state = initialState, action) => {
  switch (action.type) {
    case SET_VIEW_BOUNDS:
      return {
        ...state,
        bounds: action.bounds
      }
    case SET_GEOJSON:
      return {
        ...state,
        geoJSON: action.geoJSON
      }
    case SET_DATA_GEOJSON:
      return {
        ...state,
        dataGeoJSON: action.dataGeoJSON
      }
    case CLEAR_VIEW_BOUNDS:
    case CLEAR_ANALYSIS:
      return initialState
    default:
      return state
  }
}

export default view
