import config from '../../config'

const initialState = {
  coordinates: config.map.center,
  label: ''
}

const mapLocation = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        ...state,
        coordinates: action.latlng,
        label: action.name
      }
    case 'CLEAR_LOCATION':
      return {
        ...state,
        coordinates: config.map.center,
        label: ''
      }
    default:
      return state
  }
}

export default mapLocation
