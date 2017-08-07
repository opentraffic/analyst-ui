import protobuf from 'protobufjs'
import speedTileDescriptor from '../proto/speedtile.proto.json'

function readProtobuf (buffer) {
  const root = protobuf.Root.fromJSON(speedTileDescriptor)
  const SpeedTile = root.lookupType('SpeedTile')

  const message = SpeedTile.decode(new Uint8Array(buffer))
  const object = SpeedTile.toObject(message)

  // Verifies that the result satisfies the requirements of a valid message
  // Returns `null` if okay, and a string (error message) if not okay.
  // Throw an error if the error message is present.
  const verify = SpeedTile.verify(message)
  if (verify) {
    throw new Error(verify)
  }

  return object
}

/**
 * Consolidates an array of tiles into an object with tile level and index
 * keys so it's easier to look up, and concatenates segments back into one
 * array
 *
 * @param {Array} tiles
 * @return {Object}
 */
export function consolidateTiles (tiles) {
  return tiles.reduce((construct, source) => {
    const lv = source.level
    const ix = source.index

    if (!construct[lv]) construct[lv] = {}

    if (!construct[lv][ix]) {
      construct[lv][ix] = Object.assign({}, source) // Clone source object.
    } else {
      construct[lv][ix].segments = construct[lv][ix].segments.concat(source.segments)
    }

    return construct
  }, {})
}

export function getSpeedTiles (urls) {
  const promises = urls.map(url =>
    window.fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status)
        }

        return response.arrayBuffer()
      })
      .catch(console.log) // TODO: handle errors
  )

  return Promise.all(promises)
    .then(results => Promise.all(results.map(readProtobuf)))
    // Move all subtiles into one array
    .then(objs => objs.reduce((a, b) => a.concat(b.subtiles), []))
    // Sort all subtiles according to lowest `startSegmentIndex`
    .then(array => array.sort((a, b) => a.startSegmentIndex - b.startSegmentIndex))
    .then(consolidateTiles)
}
