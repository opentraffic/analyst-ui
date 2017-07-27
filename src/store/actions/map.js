import { SET_MAP_LOCATION, SET_MAP_VIEW } from '../actions'

// stores lat and lng of new location from MapSearchBar
export function setLocation (latlng, name) {
  return {
    type: SET_MAP_LOCATION,
    latlng,
    name
  }
}

// recenters map when location chosen from MapSearchBar
export function recenterMap (coordinates, zoom) {
  return {
    type: SET_MAP_VIEW,
    coordinates,
    zoom
  }
}
