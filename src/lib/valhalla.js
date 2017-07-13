/**
 * Functions for working with Valhalla (or Valhalla-like) API
 */

/**
 * Given an array of L.LatLng objects (from Leaflet), matching a signature of
 * { lat, lng }, construct an array of location objects compatible with the
 * Valhalla API. Reference:
 * https://mapzen.com/documentation/mobility/turn-by-turn/api-reference/#locations
 *
 * @param {Array} locations - array of L.LatLng objects
 * @returns {Array} - array of locations compatible with Valhalla API
 */
export function formatLocations (locations) {
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
