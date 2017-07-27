import config from '../../config'
import { SET_MAP_LOCATION } from '../actions'

const initialState = {
  coordinates: config.map.center,
  label: ''
}

const map = (state = initialState, action) => {
  switch (action.type) {
    case SET_MAP_LOCATION:
      return {
        ...state,
        coordinates: action.latlng,
        label: action.name
      }
    default:
      return state
  }
}

export default map
