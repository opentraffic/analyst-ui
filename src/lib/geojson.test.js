/* global it, expect */
import { merge } from './geojson'

it('merges an array of geojson objects', () => {
  const features = [
    {
      type: 'FeatureCollection',
      features: [{
        geometry: { coords: [1, 2] },
        properties: { baz: true }
      }]
    },
    {
      type: 'FeatureCollection',
      features: [{
        geometry: { coords: [0, 1] },
        properties: { foo: 'bar' }
      }]
    }
  ]
  const result = merge(features)

  expect(result.features.length).toEqual(2)
})
