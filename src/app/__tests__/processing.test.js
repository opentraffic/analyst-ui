/* eslint-env jest */
import { getSpeed } from '../processing'

describe('test data processing', () => {
  it('gets the correct speed from the historic data tile', () => {
    const hour = 8
    const segmentId = 49152
    const tile = {
      subtileSegments: 10000,
      unitSize: 604800,
      entrySize: 3600,
      speeds: new Array(1680000).fill(0)
    }

    tile.speeds[1537544] = 50

    const result = getSpeed(segmentId, tile, hour)
    expect(result).toEqual(50)
  })
})
