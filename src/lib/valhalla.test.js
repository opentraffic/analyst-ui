/* global it, expect */
import {
  leafletLatlngsToValhallaLocations,
  valhallaResponseToPolylineCoordinates
} from './valhalla'

// This tests a 2-item (minimum number) of locations to make sure types are correct
it('returns an array of location items given L.LatLng objects', () => {
  // Don't bother constructing actual L.LatLng objects, just match its signature
  const inputLocations = [
    { lat: 0, lng: 0 },
    { lat: 37.28994, lng: -97.49953 }
  ]
  const result = leafletLatlngsToValhallaLocations(inputLocations)
  const expected = [
    { lat: 0, lon: 0, type: 'break' },
    { lat: 37.28994, lon: -97.49953, type: 'break' }
  ]

  expect(result).toEqual(expected)
})

// This tests a many-item array of locations to make sure types are correct
it('properly specifies the type of intermediary location points', () => {
  const inputLocations = [
    { lat: 0, lng: 0 },
    { lat: 37.28994, lng: -97.49953 },
    { lat: 12.19834, lng: -12.99102 },
    { lat: 93.29190, lng: -28.08489 },
    { lat: 93.10982, lng: -85.29191 }
  ]
  const result = leafletLatlngsToValhallaLocations(inputLocations)
  const expected = [
    { lat: 0, lon: 0, type: 'break' },
    { lat: 37.28994, lon: -97.49953, type: 'through' },
    { lat: 12.19834, lon: -12.99102, type: 'through' },
    { lat: 93.29190, lon: -28.08489, type: 'through' },
    { lat: 93.10982, lon: -85.29191, type: 'break' }
  ]

  expect(result).toEqual(expected)
})

it('creates an array of coordinate points from a Valhalla route string', () => {
  const mockValhallaResponse = {
    trip: {
      legs: [{
        shape: 'muivlAjinblCrL~HnCjBxBxA`b@vXo]~fAku@v_Ccf@c[se@sZmh@a]mFgDya@gXaf@s[kf@s[_b@wXsByAoCkB{ZoS'
      }]
    }
  }
  const result = valhallaResponseToPolylineCoordinates(mockValhallaResponse)
  const expected = [
    { lat: 40.752487, lng: -73.981606 },
    { lat: 40.752269, lng: -73.981766 },
    { lat: 40.752197, lng: -73.98182 },
    { lat: 40.752136, lng: -73.981865 },
    { lat: 40.751575, lng: -73.982277 },
    { lat: 40.752063, lng: -73.983429 },
    { lat: 40.752933, lng: -73.985489 },
    { lat: 40.753559, lng: -73.985039 },
    { lat: 40.754177, lng: -73.984597 },
    { lat: 40.75484, lng: -73.984116 },
    { lat: 40.754959, lng: -73.984032 },
    { lat: 40.755516, lng: -73.983628 },
    { lat: 40.756141, lng: -73.98317 },
    { lat: 40.756771, lng: -73.982712 },
    { lat: 40.757331, lng: -73.9823 },
    { lat: 40.757389, lng: -73.982255 },
    { lat: 40.757461, lng: -73.982201 },
    { lat: 40.757907, lng: -73.981873 }
  ]

  expect(result).toEqual(expected)
})
