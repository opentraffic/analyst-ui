/* eslint-env jest */
import { consolidateTiles } from '../data'

it('consolidates array of tiles into a keyed object', () => {
  const tiles = [
    {
      level: 0,
      index: 1000,
      speeds: new Array(100),
      startSegmentIndex: 0,
      subtileSegments: 100,
      meta_type: 'historic',
      meta_year: '2017',
      meta_week: '01'
    },
    {
      level: 0,
      index: 1000,
      speeds: new Array(30),
      startSegmentIndex: 100,
      subtileSegments: 100,
      meta_type: 'historic',
      meta_year: '2017',
      meta_week: '01'
    },
    {
      level: 0,
      index: 1001,
      speeds: new Array(2),
      startSegmentIndex: 0,
      subtileSegments: 100,
      meta_type: 'historic',
      meta_year: '2017',
      meta_week: '01'
    },
    {
      level: 1,
      index: 1000,
      speeds: new Array(1),
      startSegmentIndex: 0,
      subtileSegments: 100,
      meta_type: 'historic',
      meta_year: '2017',
      meta_week: '01'
    }
  ]
  const result = consolidateTiles(tiles)

  expect(result).toHaveProperty('historic')

  const tile = result.historic['2017']['01']

  expect(tile).toHaveProperty('0')
  expect(tile).toHaveProperty('1')
  expect(tile['0']).toHaveProperty('1000')
  expect(tile['0']).toHaveProperty('1001')
  expect(tile['1']).toHaveProperty('1000')
  expect(tile['0']['1000']['0']).toHaveProperty('speeds')
  expect(tile['0']['1000']['1']).toHaveProperty('speeds')
})
