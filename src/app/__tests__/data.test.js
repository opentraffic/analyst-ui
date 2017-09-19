/* eslint-env jest */
import { consolidateTiles } from '../data'

it('consolidates array of tiles into a keyed object', () => {
  const tiles = [
    { level: 0, index: 1000, speeds: new Array(100), startSegmentIndex: 0, subtileSegments: 100 },
    { level: 0, index: 1000, speeds: new Array(30), startSegmentIndex: 100, subtileSegments: 100 },
    { level: 0, index: 1001, speeds: new Array(2), startSegmentIndex: 0, subtileSegments: 100 },
    { level: 1, index: 1000, speeds: new Array(1), startSegmentIndex: 0, subtileSegments: 100 }
  ]
  const result = consolidateTiles(tiles)

  expect(result).toHaveProperty('0')
  expect(result).toHaveProperty('1')
  expect(result['0']).toHaveProperty('1000')
  expect(result['0']).toHaveProperty('1001')
  expect(result['1']).toHaveProperty('1000')
  expect(result['0']['1000']['0']).toHaveProperty('speeds')
  expect(result['0']['1000']['1']).toHaveProperty('speeds')
})
