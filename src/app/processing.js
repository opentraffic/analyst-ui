import { flow, chunk, flatten, mean } from 'lodash'
import store from '../store'
import { parseSegmentId } from '../lib/tiles'
import { getCachedTiles } from './data'
import mathjs from 'mathjs'

/**
 *
 * @param {*} tiles
 * @param {*} date
 * @param {*} segment
 * @param {*} geometry
 */
export function addSpeedToMapGeometry (tiles, date, segment, geometry) {
  // not all levels and tiles are available yet, so try()
  // skips it if it doesn't work
  try {
    const state = store.getState()
    const days = state.date.dayFilter || [0, 7]
    const hours = state.date.hourFilter || [0, 24]

    const subtiles = tiles.historic[date.year][date.week][segment.level][segment.tileIdx]
    const referenceTile = tiles.reference[segment.level][segment.tileIdx]
    const subtile = getSubtileForSegmentIdx(segment.segmentIdx, subtiles)
    if (subtile) {
      // Append the speed to the geometry to render later
      const speeds = getValuesFromSubtile(segment.segmentIdx, subtile, days, hours, 'speeds')
      geometry.speedByHour = addSpeedByHour(speeds, days, hours)
      geometry.speed = getMeanSpeed(segment.segmentIdx, subtile, days, hours)
      const referenceSpeed = getMeanSpeed(segment.segmentIdx, referenceTile, days, hours)
      geometry.percentDiff = compareHistoricWithReference(geometry.speed, referenceSpeed)
    }
  } catch (e) {}
}

function compareHistoricWithReference(historic, reference) {
  const percentDiff = (historic - reference) / reference
  return percentDiff.toFixed(2)
}

function addSpeedByHour (speedArray, days, hours) {
  const speedByHour = []
  const dayStart = days[0] + 1
  const hourStart = hours[0] + 1
  const hourEnd = hours[1]

  let day = dayStart
  let hour = hourStart

  speedArray.forEach((speed, index) => {
    hour = (hour % hourEnd === 0 || index === 0) ? hourStart : hour + 1
    day = (hour !== hourStart || index === 0) ? day : day + 1
    speedByHour.push({
      'dayOfWeek': day,
      'hourOfDay': hour,
      'speedThisHour': speed
    })
  })
  return speedByHour
}

/**
 * Collect speeds from the entire week for use in bar chart
 * @param {*} tiles
 * @param {*} date
 * @param {*} segment
 */
export function prepareSpeedsForBarChart (tiles, date, segment) {
  // not all levels and tiles are available yet, so try()
  // skips it if it doesn't work
  try {
    const subtiles = tiles.historic[date.year][date.week][segment.level][segment.tileIdx]
    const subtile = getSubtileForSegmentIdx(segment.segmentIdx, subtiles)
    if (subtile) {
      var speedsByDayAndHourArray = mathjs.zeros(7, 24)
      var nonZeroSpeedCountByDayAndHourArray = mathjs.zeros(7, 24)
      var speeds = getValuesFromSubtile(segment.segmentIdx, subtile, [0, 7], [0, 24], 'speeds')
      chunk(speeds, 24).forEach((speedsForThisDay, dayIndex) => {
        speedsForThisDay.forEach((speedForThisHour, hourIndex) => {
          if (speedForThisHour > 0) {
            speedsByDayAndHourArray.set([dayIndex, hourIndex], speedForThisHour)
            nonZeroSpeedCountByDayAndHourArray.set([dayIndex, hourIndex], 1)
          }
        })
      })
      return {
        speeds: speedsByDayAndHourArray,
        counts: nonZeroSpeedCountByDayAndHourArray
      }
    }
  } catch (e) {}
}

/**
 * Given a segment index, its historic data subtile, and the range of days
 * and hours selected, calculate the mean traffic speed on that segment.
 *
 * @private
 * @param {number} segmentIdx - segment index for the tile
 * @param {object} subtile - the subtile containing segment index
 *          (note: get all tiles here, then find subtile within the function?)
 * @param {array} days
 * @param {array} hours
 * @return speed in kph
 */
export function getMeanSpeed (segmentIdx, subtile, days, hours) {
  // we want to know the overall average; TODO: consider weighting by prevalence
  const speeds = getValuesFromSubtile(segmentIdx, subtile, days, hours, 'speeds')
  // remove the zero values from the mean calculation
  const meanSpeed = mean(speeds.filter(function (val) { return val !== 0 }))

  // if result is not a number or is Infinity, return null
  return (Number.isFinite(meanSpeed)) ? meanSpeed : null
}

/**
 * @private
 * @param {number} segmentIdx - segment index for the tile
 * @param {object} subtile - the subtile containing segment index
 *          (note: get all tiles here, then find subtile within the function?)
 * @param {array} days
 * @param {array} hours
 * @param {string} prop
 * @return {Array} values
 */
export function getValuesFromSubtile (segmentIdx, subtile, days, hours, prop) {
  // Get the subtile index of the segment
  const subtileSegmentIdx = segmentIdx - subtile.startSegmentIndex

  // There is one array for every attribute. Divide unitSize by
  // entrySize to know how many entries belong to each segment,
  // and find the base index for that segment
  const entryBaseIndex = subtileSegmentIdx * (subtile.unitSize / subtile.entrySize)

  // Exit if subtile[prop] is undefined
  if (typeof subtile[prop] === 'undefined') return []

  const values = flow([
    // select the week's worth of hours relevant to this segment
    x => x.slice(entryBaseIndex, entryBaseIndex + 168),
    // split into day-long chunks
    x => chunk(x, 24),
    // filter down to the requested range of days
    x => x.slice(...days),
    // filter down to the requested range of hours
    x => x.map(speedsForGivenDay => speedsForGivenDay.slice(...hours)),
    // back to just an array of hours
    flatten
  ])(subtile[prop])

  return values
}

/**
 * Find which subtile contains a given local segment index
 *
 * @private
 * @param {Number} segmentIdx - local segment index
 * @param {Object} tiles - subtiles for a certain tile index
 * @return {Object} subtile - if found, otherwise null
 */
export function getSubtileForSegmentIdx (segmentIdx, subtiles) {
  // Subtiles are provided as an indexed object, not as an array.
  // We use a for-loop to allow early exits from the loop when the
  // correct subtile is found.
  const indices = Object.keys(subtiles)

  for (let i = 0, j = indices.length; i < j; i++) {
    const subtile = subtiles[indices[i]]

    const lowerBounds = subtile.startSegmentIndex
    const upperBounds = subtile.startSegmentIndex + subtile.subtileSegments

    if (segmentIdx >= lowerBounds && segmentIdx < upperBounds) {
      return subtile
    }
  }

  // Returns null if we reach the end of the loop without a found subtile
  return null
}

function getCurrentTimeFilter () {
  const state = store.getState()
  const year = state.date.year || 0
  const week = state.date.week || 0
  const hours = state.date.hourFilter || [0, 24]
  const days = state.date.dayFilter || [0, 7]

  return { year, week, hours, days }
}

export function getSpeedFromDataTilesForSegmentId (segmentId) {
  const segment = parseSegmentId(segmentId)
  const tiles = getCachedTiles()
  const time = getCurrentTimeFilter()

  // if any of the inputs are falsy, return null
  if (!segment || !tiles || !time.days || !time.hours) return null

  const subtiles = tiles.historic[time.year][time.week][segment.level][segment.tileIdx]
  const subtile = getSubtileForSegmentIdx(segment.segmentIdx, subtiles)

  const speed = getMeanSpeed(segment.segmentIdx, subtile, time.days, time.hours)

  if (speed !== null && speed !== undefined && speed > 0) {
    return speed
  } else {
    return null
  }
}

export function getNextSegmentDelayFromDataTiles (segmentId, nextSegmentId) {
  const segment = parseSegmentId(segmentId)
  const tiles = getCachedTiles()
  const time = getCurrentTimeFilter()

  // if any of the inputs are falsy, return null
  if (!segment || !tiles || !time.days || !time.hours) return null

  const subtiles = tiles.historic[time.year][time.week][segment.level][segment.tileIdx]
  const subtile = getSubtileForSegmentIdx(segment.segmentIdx, subtiles)

  const nextIdxs = getValuesFromSubtile(segment.segmentIdx, subtile, time.days, time.hours, 'nextSegmentIndices')
  const nextCounts = getValuesFromSubtile(segment.segmentIdx, subtile, time.days, time.hours, 'nextSegmentCounts')

  const nextSubtiles = tiles.nextsegment[time.year][time.week][segment.level][segment.tileIdx]
  const nextSubtile = getSubtileForSegmentIdx(segment.segmentIdx, nextSubtiles)

  const delays = []
  for (let i = 0; i < nextIdxs.length; i++) {
    const nextIdx = nextIdxs[i]
    const nextCount = nextCounts[i]

    for (let j = nextIdx; j < (nextIdx + nextCount); j++) {
      if (nextSubtile.nextSegmentIds[j] === nextSegmentId) {
        const delay = nextSubtile.nextSegmentDelays[j]
        delays.push(delay)
      }
    }
  }

  if (delays.length > 0) {
    const meanDelay = mean(delays)

    // if result is not a number or is Infinity, return null
    return (Number.isFinite(meanDelay)) ? meanDelay : null
  } else {
    return null
  }
}
