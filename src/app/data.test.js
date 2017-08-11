/* global it, expect */
import { consolidateTiles } from './data'

it('consolidates array of tiles into a keyed object', () => {
  const tiles = [
    { level: 0, index: 1000, speeds: new Array(100) },
    { level: 0, index: 1000, speeds: new Array(30) },
    { level: 0, index: 1001, speeds: new Array(2) },
    { level: 1, index: 1000, speeds: new Array(1) }
  ]
  const result = consolidateTiles(tiles)

  expect(result).toHaveProperty('0')
  expect(result).toHaveProperty('1')
  expect(result['0']).toHaveProperty('1000')
  expect(result['0']).toHaveProperty('1001')
  expect(result['1']).toHaveProperty('1000')
  expect(result['0']['1000'].length).toEqual(2)
  expect(result['0']['1001'].length).toEqual(1)
  expect(result['0']['1001'][0]).toHaveProperty('speeds')
})
