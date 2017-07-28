import config from '../../config'
import { SET_MAP_LOCATION, SET_LABEL, SET_MAP_VIEW } from '../actions'

const initialState = {
  coordinates: config.map.center,
  zoom: config.map.zoom,
  label: ''
}

const map = (state = initialState, action) => {
  switch (action.type) {
    case SET_MAP_LOCATION:
      return {
        ...state,
        coordinates: action.latlng,
        label: action.label
      }
    case SET_LABEL:
      return {
        ...state,
        label: action.label
      }
    case SET_MAP_VIEW:
      return {
        ...state,
        coordinates: action.coordinates,
        zoom: action.zoom
      }
    default:
      return state
  }
}

export default map
