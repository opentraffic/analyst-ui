/* eslint-env jest */
import {
  getMeanSpeed,
  convertLocalSegmentToSubtileIndex,
  getSubtileForSegmentId,
  getIndicesFromDayAndHourFilters
  // getSpeedFromDataTilesForSegmentId,
  // getNextSegmentDelayFromDataTiles
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

describe('getIndicesFromDayAndHourFilters', () => {
  it('', () => {
    const days = [0, 7]
    const hours = [0, 24]
    const result = getIndicesFromDayAndHourFilters(days, hours)
    const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167]
    expect(result).toEqual(expected)
  })

  it('', () => {
    const days = [0, 1]
    const hours = [13, 14]
    const result = getIndicesFromDayAndHourFilters(days, hours)
    const expected = [13]
    expect(result).toEqual(expected)
  })

  it('', () => {
    const days = [4, 5]
    const hours = [8, 12]
    const result = getIndicesFromDayAndHourFilters(days, hours)
    const expected = [104, 105, 106, 107]
    expect(result).toEqual(expected)
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
