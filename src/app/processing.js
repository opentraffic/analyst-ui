import { chain } from 'lodash'
import store from '../store'
import { parseSegmentId } from '../lib/tiles'
import { getCachedTiles } from './data'

// TODO: rename / refactor.
export function addSpeedToThing (tiles, date, item, thing) {
  // not all levels and tiles are available yet, so try()
  // skips it if it doesn't work
  try {
    const state = store.getState()
    const days = state.date.dayFilter || [0, 7]
    const hours = state.date.hourFilter || [0, 24]

    const segmentId = item.segment
    // const reftile = tiles.reference && tiles.reference[item.level][item.tile]
    const subtiles = tiles.historic[date.year][date.week][item.level][item.tile]

    const subtile = getSubtileForSegmentId(segmentId, subtiles)
    if (subtile) {
      // Append the speed to the thing to render later
      thing.speed = getMeanSpeed(segmentId, subtile, days, hours)

      // } else if (reftile && reftile.referenceSpeeds80[desiredIndex] !== -1) {
      //   thing.speed = getMeanSpeed(reftile.referenceSpeeds80[desiredIndex]
      // } else {
      //   thing.speed = 0
      // }
    }
  } catch (e) {}
}

/**
 * @private
 * @param {number} segmentId
 * @param {object} tile
 * @param {array} days
 * @param {array} hours
 */
export function getMeanSpeed (segmentId, tile, days, hours) {
  // Get the subtile index of the segment
  const subtileSegmentId = convertLocalSegmentToSubtileIndex(segmentId, tile)

  // There is one array for every attribute. Divide unitSize by
  // entrySize to know how many entries belong to each segment,
  // and find the base index for that segment
  const entryBaseIndex = subtileSegmentId * (tile.unitSize / tile.entrySize)

  const speedsByHour = chain(tile.speeds)
    .slice(entryBaseIndex, entryBaseIndex + 168) // select the week's worth of hours relevant to this segment
    .chunk(24) // split into day-long chunks
    .slice(...days) // filter down to the requested range of days
    .map((speedsForGivenDay) => {
      return speedsForGivenDay.slice(...hours) // filter down to the requested range of hours
    })
    .flatten() // back to just an array of hours
    .value()
  // console.log(`speedsByHour: ${speedsByHour} (hour count=${speedsByHour.length})`)

  const meanSpeed = chain(speedsByHour)
    .mean() // we want to know the overall average; TODO: consider weighting by prevalence
    .value()
  // console.log(`meanSpeed: ${meanSpeed}`)

  return meanSpeed
}

/**
 * converts a local segment index, e.g. `15000`, to a subtile segment index,
 * e.g. `5000`.  Note that the `subtile.subtileSegments` property now reports
 * only the number of segments in the current subtile, rather than an indicator
 * of the max number of segments a tile is chunked by.
 *
 * @private
 * @param {Number} segmentId - local segment index
 * @param {Object} subtile
 * @param {Number} subtileIndex - subtile-level segment index
 */
export function convertLocalSegmentToSubtileIndex (segmentId, subtile) {
  return segmentId - subtile.startSegmentIndex
}

/**
 * Find which subtile contains a given local segment index
 *
 * @private
 * @param {Number} segmentId - local segment index
 * @param {Object} tiles - subtiles for a certain tile index
 * @return {Object} subtile - if found, otherwise null
 */
export function getSubtileForSegmentId (segmentId, subtiles) {
  // Subtiles are provided as an indexed object, not as an array.
  // We use a for-loop to allow early exits from the loop when the
  // correct subtile is found.
  const indices = Object.keys(subtiles)

  for (let i = 0, j = indices.length; i < j; i++) {
    const subtile = subtiles[indices[i]]

    const lowerBounds = subtile.startSegmentIndex
    const upperBounds = subtile.startSegmentIndex + subtile.subtileSegments

    if (segmentId >= lowerBounds && segmentId < upperBounds) {
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
  const id = parseSegmentId(segmentId)
  const tiles = getCachedTiles()
  const time = getCurrentTimeFilter()

  // if any of the inputs are falsy, return null
  if (!id || !tiles || !time.days || !time.hours) return null

  const subtiles = tiles.historic[time.year][time.week][id.level][id.tile]
  const subtile = getSubtileForSegmentId(segmentId, subtiles)
  const speed = getMeanSpeed(id, subtile, time.days, time.hours)

  if (speed !== null && speed !== undefined) {
    return speed
  } else {
    return null
  }
}

export function getNextSegmentDelayFromDataTiles (segmentId, nextSegmentId = 1) {
  const id = parseSegmentId(segmentId)
  const nextId = parseSegmentId(nextSegmentId)
  const tiles = getCachedTiles()
  const time = getCurrentTimeFilter()

  // if any of the inputs are falsy, return null
  if (!id || !nextId || !tiles || !time.days || !time.hours) return null

  const subtiles = tiles.historic[time.year][time.week][id.level][id.tile]
  const subtile = getSubtileForSegmentId(segmentId, subtiles)
  const tile = subtile
  const subtileSegmentId = convertLocalSegmentToSubtileIndex(segmentId, tile)
  const entryBaseIndex = subtileSegmentId * (tile.unitSize / tile.entrySize)

  const indices = getIndicesFromDayAndHourFilters(time.days, time.hours)

  const nextSegmentLookups = []
  for (let i = 0; i < indices.length; i++) {
    const id = entryBaseIndex + indices[i]
    const nextSegmentIndex = tile.nextSegmentIndices[id]
    const nextSegmentCount = tile.nextSegmentCounts[id]
    console.log('nextSegment', nextSegmentIndex, nextSegmentCount)
    nextSegmentLookups.push([nextSegmentIndex, nextSegmentCount])
  }

  const nextSegmentSubtiles = tiles.nextsegment[time.year][time.week][id.level][id.tile]
  const nextSegmentTile = getSubtileForSegmentId(segmentId, nextSegmentSubtiles)

  console.log(nextSegmentTile)
  return null
}
