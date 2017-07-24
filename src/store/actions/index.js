// recenters map when location chosen from MapSearchBar
export function recenterMap (coordinates, zoom) {
  return {
    type: 'CHANGE_CENTER',
    coordinates,
    zoom
  }
}

// stores lat and lng of new location from MapSearchBar
export function setLocation (latlng, name) {
  return {
    type: 'SET_LOCATION',
    latlng,
    name
  }
}

export function setDate(startDate, endDate) {
  return {
    type: 'SET_DATE',
    startDate,
    endDate
  }
}
