/* global it, expect */
import { consolidateTiles } from './data'

it('consolidates array of tiles into a keyed object', () => {
  const tiles = [
    { level: 0, index: 1000, segments: new Array(100) },
    { level: 0, index: 1000, segments: new Array(30) },
    { level: 0, index: 1001, segments: new Array(2) },
    { level: 1, index: 1000, segments: new Array(1) }
  ]
  const result = consolidateTiles(tiles)

  expect(result).toHaveProperty('0')
  expect(result).toHaveProperty('1')
  expect(result['0']).toHaveProperty('1000')
  expect(result['0']).toHaveProperty('1001')
  expect(result['1']).toHaveProperty('1000')
  expect(result['0']['1000'].segments.length).toEqual(130)
  expect(result['0']['1001'].segments.length).toEqual(2)
  expect(result['1']['1000'].segments.length).toEqual(1)
})
