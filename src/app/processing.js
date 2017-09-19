import store from '../store'

export function addSpeedToThing (tiles, item, thing) {
  // not all levels and tiles are available yet, so try()
  // skips it if it doesn't work
  try {
    const segmentId = item.segment
    const subtiles = tiles[item.level][item.tile]
    // find which subtile contains this segment id
    const subtileIds = Object.keys(subtiles)

    const hour = store.getState().date.hourFilter[0]

    for (let i = 0, j = subtileIds.length; i < j; i++) {
      const tile = subtiles[subtileIds[i]]
      const upperBounds = (i === j - 1) ? tile.totalSegments : (tile.startSegmentIndex + tile.subtileSegments)
      // if this is the right tile, get the reference speed for the
      // current segment and attach it to the item.
      if (segmentId > tile.startSegmentIndex && segmentId <= upperBounds) {
        // Get the local id of the segment
        // (eg. id 21000 is local id 1000 if tile segment size is 10000)
        const subtileSegmentId = segmentId % tile.subtileSegments
        // There is one array for every attribute. Divide unitSize by
        // entrySize to know how many entries belong to each segment,
        // and find the base index for that segment
        const entryBaseIndex = subtileSegmentId * (tile.unitSize / tile.entrySize)
        // Add the desired hour (0-index) to get the correct index value
        const desiredIndex = entryBaseIndex + hour

        // Append the speed to the thing to render later
        thing.speed = tile.speeds[desiredIndex]

        break
      }
    }
  } catch (e) {}
}
