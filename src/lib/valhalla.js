/**
 * Functions for working with Valhalla (or Valhalla-like) API
 */
import polyline from '@mapbox/polyline'

/**
 * Given an array of L.LatLng objects (from Leaflet), matching a signature of
 * { lat, lng }, construct an array of location objects compatible with the
 * Valhalla API. Reference:
 * https://mapzen.com/documentation/mobility/turn-by-turn/api-reference/#locations
 *
 * @param {Array} locations - array of L.LatLng objects
 * @returns {Array} - array of locations compatible with Valhalla API
 */
export function leafletLatlngsToValhallaLocations (locations) {
  return locations.map((location, index, array) => {
    // Do not use / modify the original location. Create a new object for
    // routing query. Valhalla requires `lon` syntax over `lng`.
    const item = {
      lat: location.lat,
      lon: location.lng
    }

    // Intermediary points are of type `through`.
    // Start and end points must be of type `break`.
    item.type = 'through'
    if (index === 0 || index === array.length - 1) item.type = 'break'

    return item
  })
}

/**
 * Given a Valhalla (or Valhalla-like) response payload, decode the route
 * string into an array of coordinates matching the signature { lat, lng },
 * which can be used to display on a Leaflet map using its Polyline API.
 *
 * @requires @mapbox/polyline
 * @param {Object} response - the response payload from a Valhalla-compatible API
 * @returns {Array} - array of lat/lng points to be displayed on Leaflet.
 */
export function valhallaResponseToPolylineCoordinates (response) {
  const COORDINATE_PRECISION = 6
  const coordinates = []

  for (let i = 0; i < response.trip.legs.length; i++) {
    const coord = polyline.decode(response.trip.legs[i].shape, COORDINATE_PRECISION)

    for (let k = 0; k < coord.length; k++) {
      coordinates.push({ lat: coord[k][0], lng: coord[k][1] })
    }
  }

  return coordinates
}
