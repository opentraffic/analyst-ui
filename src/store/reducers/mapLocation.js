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
		default:
			return state
	}
}

export default mapLocation
