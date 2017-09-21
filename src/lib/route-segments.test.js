/* eslint-env jest */
import { getSegmentWidth,
         getLinearValue,
         STOPS,
         ZERO_SPEED_STOPS
} from './route-segments.js'

describe('if speed != 0, returns segment width value using STOPS array based on zoom level', () => {
  it('returns the first value of STOPS array if zoom level <= first zoom value and speed != 0', () => {
    const firstZoom = STOPS[0][0]
    const firstWidth = STOPS[0][1]
    const result = getSegmentWidth(firstZoom - 2, 10)
    const expected = Number(firstWidth.slice(0, -2))

    expect(result).toEqual(expected)
  })

  it('returns the segment width value matching zoom level of STOPS array if speed != 0', () => {
    const zoomValue = STOPS[1][0]
    const segmentWidth = STOPS[1][1]
    const result = getSegmentWidth(zoomValue, 10)
    const expected = Number(segmentWidth.slice(0, -2))

    expect(result).toEqual(expected)
  })

  it('returns the last value of STOPS array if zoom level >= last zoom value and speed != 0', () => {
    const lastZoom = STOPS[STOPS.length - 1][0]
    const lastWidth = STOPS[STOPS.length - 1][1]
    const result = getSegmentWidth(lastZoom + 2, 10)
    const expected = Number(lastWidth.slice(0, -2))

    expect(result).toEqual(expected)
  })

  it('returns the linear interpolation of zoom value using STOPS array if given intermediate zoom level and speed !== 0', () => {
    const result = getSegmentWidth(16, 10)
    const expected = 3.5

    expect(result).toEqual(expected)
  })
})

describe('if speed == 0, returns segment width value using ZERO_SPEED_STOPS array based on zoom level', () => {
  it('returns the value of segment width matching the zoom level using ZERO_SPEED_STOPS if speed = null or speed = undefined', () => {
    const zoomValue = ZERO_SPEED_STOPS[1][0]
    const segmentWidth = ZERO_SPEED_STOPS[1][1]
    const result1 = getSegmentWidth(zoomValue, null)
    const result2 = getSegmentWidth(zoomValue, undefined)
    const expected = Number(segmentWidth.slice(0, -2))

    expect(result1).toEqual(expected)
    expect(result2).toEqual(expected)
  })

  it('returns the first value of ZERO_SPEED_STOPS array if zoom level <= first zoom value and speed == 0', () => {
    const firstZeroZoom = ZERO_SPEED_STOPS[0][0]
    const firstZeroWidth = ZERO_SPEED_STOPS[0][1]
    const result = getSegmentWidth(firstZeroZoom, 0)
    const expected = Number(firstZeroWidth.slice(0, -2))

    expect(result).toEqual(expected)
  })

  it('returns the last value of ZERO_SPEED_STOPS array if zoom level >= last zoom value and speed == 0', () => {
    const lastZeroZoom = ZERO_SPEED_STOPS[ZERO_SPEED_STOPS.length - 1][0]
    const lastZeroWidth = ZERO_SPEED_STOPS[ZERO_SPEED_STOPS.length - 1][1]
    const result = getSegmentWidth(lastZeroZoom, 0)
    const expected = Number(lastZeroWidth.slice(0, -2))

    expect(result).toEqual(expected)
  })

  it('returns the linear interpolation of zoom value using ZERO_SPEED_STOPS array if given intermediate zoom level and speed == 0', () => {
    const result = getSegmentWidth(16, 0)
    const expected = 0.75

    expect(result).toEqual(expected)
  })
})

describe('returns y value (segment width) by calculating linear equation using two given points', () => {
  it('returns the linear interpolation of zoom value, given two points in (zoom, width) format', () => {
    const point1 = [12, 3]
    const point2 = [14, 6]
    const zoomValue = 13
    const result = getLinearValue(point1[0], point1[1], point2[0], point2[1], zoomValue)
    const expected = 4.5

    expect(result).toEqual(expected)
  })
})
