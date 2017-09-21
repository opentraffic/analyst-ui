/* eslint-env jest */
import {getMeanSpeed} from '../processing'

describe('getMeanSpeed', () => {
  const segmentId = 49152
  const tile = {
    subtileSegments: 10000,
    unitSize: 604800,
    entrySize: 3600,
    speeds: new Array(1680000).fill(20)
  }

  it('can select one hour from 1 day', () => {
    tile.speeds[1537544] = 50
    expect(getMeanSpeed(segmentId, tile, [0, 1], [8, 9])).toEqual(50)
  })

  it('can average 2 hours from 1 day', () => {
    tile.speeds[1537544] = 50
    expect(getMeanSpeed(segmentId, tile, [0, 1], [8, 10])).toEqual(35)
  })

  it('can average 1 hour from 3 days', () => {
    tile.speeds[1537544] = 50
    expect(getMeanSpeed(segmentId, tile, [5, 7], [20, 22])).toEqual(20)
  })
})
