/* eslint-env jest */
import {
  getMeanSpeed,
  convertLocalSegmentToSubtileIndex,
  getSubtileForSegmentId,
  getSpeedFromDataTilesForSegmentId,
  getNextSegmentDelayFromDataTiles
} from '../processing'

describe('getMeanSpeed', () => {
  const segmentId = 49152
  const tile = {
    subtileSegments: 10000,
    startSegmentIndex: 40000,
    totalSegments: 49200,
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

describe('convertLocalSegmentToSubtileIndex', () => {
  it('converts a low number', () => {
    const subtile = {
      startSegmentIndex: 0,
      subtileSegments: 10000,
      totalSegments: 29072
    }
    const result = convertLocalSegmentToSubtileIndex(5000, subtile)
    expect(result).toEqual(5000)
  })

  it('converts a high number', () => {
    const subtile = {
      startSegmentIndex: 20000,
      subtileSegments: 10000,
      totalSegments: 29072
    }
    const result = convertLocalSegmentToSubtileIndex(25000, subtile)
    expect(result).toEqual(5000)
  })
})

describe('getSubtileForSegmentId', () => {
  const subtiles = {
    0: {
      startSegmentIndex: 0,
      subtileSegments: 10000,
      totalSegments: 29072
    },
    1: {
      startSegmentIndex: 10000,
      subtileSegments: 10000,
      totalSegments: 29072
    },
    2: {
      startSegmentIndex: 20000,
      subtileSegments: 9072,
      totalSegments: 29072
    }
  }

  it('returns a subtile at 0 for segment index 0', () => {
    const id = 0
    const result = getSubtileForSegmentId(id, subtiles)
    expect(result).toEqual(subtiles[0])
  })

  it('returns a subtile at 0 for segment index 9999', () => {
    const id = 9999
    const result = getSubtileForSegmentId(id, subtiles)
    expect(result).toEqual(subtiles[0])
  })

  it('returns a subtile at 1 for segment index 10000', () => {
    const id = 10000
    const result = getSubtileForSegmentId(id, subtiles)
    expect(result).toEqual(subtiles[1])
  })

  it('returns a subtile at 2 for segment index 25000', () => {
    const id = 25000
    const result = getSubtileForSegmentId(id, subtiles)
    expect(result).toEqual(subtiles[2])
  })

  it('returns null for segment index 29999', () => {
    const id = 29999
    const result = getSubtileForSegmentId(id, subtiles)
    expect(result).toEqual(null)
  })
})

// describe('getSpeedFromDataTilesForSegmentId', () => {
//   it('returns null if no value is found', () => {
//     expect(getSpeedFromDataTilesForSegmentId(49152)).toEqual(null)
//   })
// })
//
// describe('getNextSegmentDelayFromDataTiles', () => {
//   it('returns null if no value is found', () => {
//     expect(getNextSegmentDelayFromDataTiles(49152)).toEqual(null)
//   })
// })
