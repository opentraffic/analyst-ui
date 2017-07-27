import initialState from '../../config'
import { SET_MAP_VIEW } from '../actions'

const config = (state = initialState, action) => {
  switch (action.type) {
    case SET_MAP_VIEW:
      return {
        ...state,
        map: {
          center: action.coordinates,
          zoom: action.zoom
        }
      }
    default:
      return state
  }
}

export default config
