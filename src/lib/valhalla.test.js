/* global it, expect */
import { formatLocations } from './valhalla'

// This tests a 2-item (minimum number) of locations to make sure types are correct
it('returns an array of location items given L.LatLng objects', () => {
  // Don't bother constructing actual L.LatLng objects, just match its signature
  const inputLocations = [
    { lat: 0, lng: 0 },
    { lat: 37.28994, lng: -97.49953 }
  ]
  const result = formatLocations(inputLocations)
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
  const result = formatLocations(inputLocations)
  const expected = [
    { lat: 0, lon: 0, type: 'break' },
    { lat: 37.28994, lon: -97.49953, type: 'through' },
    { lat: 12.19834, lon: -12.99102, type: 'through' },
    { lat: 93.29190, lon: -28.08489, type: 'through' },
    { lat: 93.10982, lon: -85.29191, type: 'break' }
  ]

  expect(result).toEqual(expected)
})
