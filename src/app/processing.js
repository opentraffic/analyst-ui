import store from '../store'
import { chain } from 'lodash'

export function addSpeedToThing (tiles, item, thing) {
  // not all levels and tiles are available yet, so try()
  // skips it if it doesn't work
  try {
    const segmentId = item.segment
    const subtiles = tiles[item.level][item.tile]
    // find which subtile contains this segment id
    const subtileIds = Object.keys(subtiles)

    const hours = store.getState().date.hourFilter || [0, 24]
    const days = store.getState().date.dayFilter || [0, 7]
    console.log(`hours=${hours} days=${days}`)

    for (let i = 0, j = subtileIds.length; i < j; i++) {
      const tile = subtiles[subtileIds[i]]
      const upperBounds = (i === j - 1) ? tile.totalSegments : (tile.startSegmentIndex + tile.subtileSegments)
      // if this is the right tile, get the reference speed for the
      // current segment and attach it to the item.
      if (segmentId > tile.startSegmentIndex && segmentId <= upperBounds) {
        // Append the speed to the thing to render later
        thing.speed = getMeanSpeed(segmentId, tile, days, hours)

        break
      }
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
  // Get the local id of the segment
  // (eg. id 21000 is local id 1000 if tile segment size is 10000)
  const subtileSegmentId = segmentId % tile.subtileSegments
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
  console.log(`speedsByHour: ${speedsByHour} (hour count=${speedsByHour.length})`)
  const meanSpeed = chain(speedsByHour)
    .mean() // we want to know the overall average; TODO: consider weighting by prevalence
    .value()
  console.log(`meanSpeed: ${meanSpeed}`)
  return meanSpeed
}
