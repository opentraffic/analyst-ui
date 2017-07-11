import initialState from '../../config'

const config = (state = initialState, action) => {
  switch (action.type) {
  	case 'CHANGE_CENTER':
  		return {
  			...state,
  			map: {
  				center: action.coordinates,
  				zoom: 7,
  			}
  		}
    default:
      return state
  }
}

export default config
