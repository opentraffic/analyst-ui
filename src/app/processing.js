import { flow, chunk, flatten, mean } from 'lodash'
import store from '../store'
import { parseSegmentId } from '../lib/tiles'
import { getCachedTiles } from './data'

// TODO: rename / refactor.
export function addSpeedToThing (tiles, date, segment, thing) {
  // not all levels and tiles are available yet, so try()
  // skips it if it doesn't work
  try {
    const state = store.getState()
    const days = state.date.dayFilter || [0, 7]
    const hours = state.date.hourFilter || [0, 24]

    const subtiles = tiles.historic[date.year][date.week][segment.level][segment.tileIdx]

    const subtile = getSubtileForSegmentIdx(segment.segmentIdx, subtiles)
    if (subtile) {
      // Append the speed to the thing to render later
      thing.speed = getMeanSpeed(segment.segmentIdx, subtile, days, hours)

      // } else if (reftile && reftile.referenceSpeeds80[desiredIndex] !== -1) {
      //   thing.speed = getMeanSpeed(reftile.referenceSpeeds80[desiredIndex]
      // } else {
      //   thing.speed = 0
      // }
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
  // Get the subtile index of the segment
  const subtileSegmentIdx = segmentIdx - subtile.startSegmentIndex

  // There is one array for every attribute. Divide unitSize by
  // entrySize to know how many entries belong to each segment,
  // and find the base index for that segment
  const entryBaseIndex = subtileSegmentIdx * (subtile.unitSize / subtile.entrySize)

  const speedsByHour = flow([
    // select the week's worth of hours relevant to this segment
    x => x.slice(entryBaseIndex, entryBaseIndex + 168),
    // split into day-long chunks
    x => chunk(x, 24),
    // filter down to the requested range of days
    x => x.slice(...days),
    // filter down to the requested range of hours
    x => x.map(speedsForGivenDay => speedsForGivenDay.slice(...hours)),
    // back to just an array of hours
    flatten,
    // we want to know the overall average; TODO: consider weighting by prevalence
    mean
  ])(subtile.speeds)

  // if result is not a number, return null
  return (Number.isNaN(speedsByHour) === true) ? null : speedsByHour
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

export function getIndicesFromDayAndHourFilters (days, hours) {
  const indices = []

  // given days [i, m] fills in values [i, j, k, l] - non-inclusive
  const daysConverted = []
  for (let i = days[0]; i < days[1]; i++) {
    daysConverted.push(i)
  }

  // same for hours
  const hoursConverted = []
  for (let i = hours[0]; i < hours[1]; i++) {
    hoursConverted.push(i)
  }

  for (let i = 0; i < daysConverted.length; i++) {
    for (let j = 0; j < hoursConverted.length; j++) {
      const day = daysConverted[i]
      const hour = hoursConverted[j]
      const dayBase = day * 24
      indices.push(dayBase + hour)
    }
  }

  return indices
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
  // Get the subtile index of the segment
  const subtileSegmentIdx = segment.segmentIdx - subtile.startSegmentIndex
  // There is one array for every attribute. Divide unitSize by
  // entrySize to know how many entries belong to each segment (168 hours for 1 week),
  // and find the base index for that segment
  const entryBaseIndex = subtileSegmentIdx * (subtile.unitSize / subtile.entrySize)
  const segmentIdxForHour = entryBaseIndex + time.hours[0]
  // get the next segments that are paired with this segment Id
  const nextIdx = subtile.nextSegmentIndices[segmentIdxForHour]
  const nextCount = subtile.nextSegmentCounts[segmentIdxForHour]

  const nextSubtiles = tiles.nextsegment[time.year][time.week][segment.level][segment.tileIdx]
  const nextSubtile = getSubtileForSegmentIdx(segment.segmentIdx, nextSubtiles)
  var delay = 0
  for (var i = nextIdx; i < (nextIdx + nextCount); i++) {
    if (nextSubtile.nextSegmentIds[i] === nextSegmentId) {
      delay = nextSubtile.nextSegmentDelays[i]
    }
  }

  if (delay.length >= 0) {
    return delay
  } else {
    return null
  }
}
