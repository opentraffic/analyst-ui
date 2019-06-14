/**
 * Functions for working with Valhalla (or Valhalla-like) API
 */
import polyline from '@mapbox/polyline'
import { request } from './fetch-utils'

// Valhalla uses a 6-digit precision; the @mapbox/polyline library defaults
// to 5 when not specified.
const COORDINATE_PRECISION = 6

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
  const coordinates = []

  for (let i = 0; i < response.trip.legs.length; i++) {
    const coord = polyline.decode(response.trip.legs[i].shape, COORDINATE_PRECISION)

    for (let k = 0; k < coord.length; k++) {
      coordinates.push({ lat: coord[k][0], lng: coord[k][1] })
    }
  }

  return coordinates
}

/**
 * Makes a Valhalla (or Valhalla-like) request and returns a Promise
 * with the JSON response or an error. Uses a specially wrapped `fetch` which
 * can handle a JSON payload response in addition to an HTTP error code.
 *
 * @param {string} host - the remote resource to request from
 * @param {string} endpoint - the remote endpoint, e.g. "route"
 * @param {Object} payload - serializable object containing Valhalla query
 * @return {Promise}
 */
function makeValhallaRequest (host, endpoint, payload) {
  const options = {}
  const baseUrl = `http://${host}/${endpoint}`
  const stringPayload = JSON.stringify(payload)

  let url

  switch (endpoint) {
    case 'route':
      options.method = 'GET'
      url = baseUrl + `?json=${stringPayload}`
      break
    case 'trace_attributes':
      options.method = 'POST'
      options.body = stringPayload
      url = baseUrl
      break
    default:
      break
  }

  return request(url, options)
}

/**
 * Makes a Valhalla (or Valhalla-like) request to the `route`
 * endpoint and returns a Promise with the JSON response or an error.
 *
 * @param {string} host - the remote resource to request from
 * @param {string} waypoints - array of LatLng coordinate objects matching
 *          the shape { lat, lng }
 */
export function getRoute (host, waypoints) {
  const payload = {
    locations: leafletLatlngsToValhallaLocations(waypoints),
    costing: 'auto'
  }

  return makeValhallaRequest(host, 'route', payload)
}

/**
 * Makes a Valhalla (or Valhalla-like) request to the `trace_attributes`
 * endpoint and returns a Promise with the JSON response or an error.
 *
 * @param {string} host - the remote resource to request from
 * @param {string} coordinates - array of LatLng coordinate objects matching
 *          the shape { lat, lng }
 */
export function getTraceAttributes (host, coordinates) {
  const format = coordinates.map(location => [ location.lat, location.lng ])
  const shape = polyline.encode(format, COORDINATE_PRECISION)
  const payload = {
    encoded_polyline: shape,
    costing: 'auto',
    shape_match: 'edge_walk'
  }

  return makeValhallaRequest(host, 'trace_attributes', payload)
}
