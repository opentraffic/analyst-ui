import store from '../store'
import protobuf from 'protobufjs'
import { filter, uniq } from 'lodash'
import speedTileDescriptor from '../proto/speedtile.proto.json'
import { getTileUrlSuffix } from '../lib/tiles'

const tileCache = {}


function getPath () {
  return store.getState().date.staticDataTilePath
}

/**
 * Uses `protobuf.js` module to parse and read a `SpeedTile` protocol buffer.
 * Throws an error if the message cannot be verified.
 * Relies on the imported `speedtile.proto` descriptor in JSON format. This
 * is pre-generated, which allows us to skip making a network request for
 * the original protobuf file.
 *
 * @param {ArrayBuffer} buffer - the raw ArrayBuffer response from `fetch()`
 * @return {Object} - the protobuf, converted to JavaScript object
 */
function readDataTiles (buffer) {
  const root = protobuf.Root.fromJSON(speedTileDescriptor)
  const SpeedTile = root.lookupType('SpeedTile')
  const message = SpeedTile.decode(new Uint8Array(buffer))

  // Verifies that the result satisfies the requirements of a valid message.
  // The verification method returns `null` if it is okay, and a string
  // (error message) if it is not okay.
  // Throws an error if the error message is present.
  const verify = SpeedTile.verify(message)
  if (verify) {
    throw new Error(verify)
  }

  // Returns the message as a plain JavaScript object
  return SpeedTile.toObject(message)
}

/**
 * Consolidates an array of data tiles into an object with tile level and index
 * keys so it's easier to look up
 *
 * @param {Array<Object>} tiles - array of data tiles (as parsed from protobuf)
 * @return {Object} - a single object. Top-level keys are tile level.
 *            Second-level keys are tile index. Each second-level key
 *            contains an array of subtiles.
 */
export function consolidateTiles (tiles) {
  return tiles.reduce((construct, source) => {
    const level = source.level
    const index = source.index
    const subtile = source.startSegmentIndex / source.subtileSegments

    if (!construct[level]) construct[level] = {}
    if (!construct[level][index]) construct[level][index] = {}

    construct[level][index][subtile] = source

    return construct
  }, {})
}

/**
 * Test: tile cache
 */
function cacheTiles (tiles) {
  Object.assign(tileCache, tiles)
  return tiles
}

/**
 * Given 0-level tiles, figure out how many subtiles there are
 */
function figureOutHowManySubtilesThereAre (tile) {
  return Math.ceil(tile.totalSegments / tile.subtileSegments)
}

/**
 * Fetch one data tile given a id suffix and a subtile number
 *
 * @param {Object} suffix - file path to data tile
 * @param {Number} subtile - number of subtile to download (default is 0)
 * @returns {Promise} - resolved to either a plain JS object of the data tile,
 *            _or_ an error object { error: true } if it failed. We don't
 *            want this to throw because data tile fetch errors should be
 *            skipped
 */
function fetchDataTile (suffix, subtile = 0) {
  const url = `${getPath()}${suffix}.spd.${subtile}.gz`

  return window.fetch(url)
    .then((response) => {
      // If a data tile fails to fetch, don't immediately reject; instead,
      // resolve with an error object. We'll deal with these later.
      if (!response.ok) {
        console.warn(`[analyst-ui] Unable to fetch a data tile from ${response.url}. The status code given was ${response.status}.`)
        return Promise.resolve({ error: true })
      }

      return response.arrayBuffer()
        // Read protobuf message and convert to plain object
        .then(readDataTiles)
        // We only want the child data object
        .then(protobufMessage => protobufMessage.subtiles[0])
    })
}

/**
 * Fetches all requested OpenTraffic data tiles and concatenates them into
 * a single object. If tiles are cached, retrieve those instead of performing
 * the actual network request.
 *
 * @todo: Cache urls and tile responses so that anything that is already
 * in cache do not need to be re-fetched. We may need to set a dynamic
 * cache limit based on available memory, if that's something we can determine.
 *
 * @param {Array<Object>} ids - a list of ids in the format { level, tile }
 * @return {Promise} - resolved with an object where tiles with level and
 *            tile index mapped to a nested key structure.
 */
export function fetchDataTiles (ids) {
  // Temporary. If tilecache has values, return Promise-resolving as-is.
  if (Object.keys(tileCache).length > 0) {
    return Promise.resolve(tileCache)
  }

  // Obtain a list of unique tile suffixes
  const simpleIds = ids.map(id => getTileUrlSuffix({ level: id.level, tile: id.tile }))
  const uniqueIds = uniq(simpleIds)

  // Fetch each suffix at subtile level 0.
  const promises = uniqueIds.map((id) => fetchDataTile(id))

  return Promise.all(promises)
    // Reject from the responses all tiles that have errored out. Log the
    // broken tile url with status code to the console. Return a final array
    // of ArrayBuffers.
    .then(responses => filter(responses, response => response.error !== true))
    .then(tiles => {
      const newTiles = tiles.reduce((accumulator, tile) => {
        const numSubtiles = figureOutHowManySubtilesThereAre(tile)
        const toDownload = []
        const id = { level: tile.level, tile: tile.index }
        const suffix = getTileUrlSuffix(id)

        // Start at 1 because we already downloaded subtile at 0
        for (let i = 1; i < numSubtiles; i++) {
          toDownload.push(fetchDataTile(suffix, i))
        }

        // TEST: reference speed tile:
        fetchReferenceSpeedTile(suffix)
          .then(data => { console.log('ref speed tile', data) })

        return accumulator.concat(toDownload)
      }, [])

      return Promise.all(newTiles)
        .then(responses => filter(responses, response => response.error !== true))
        .then(tiles2 => tiles.concat(tiles2))
    })
    // Consolidate all subtiles into a single object with lookup keys
    .then(consolidateTiles)
    .then(cacheTiles)
}

/* TODO: consolidate with fetchDataTile() */
function fetchReferenceSpeedTile (suffix) {
  const url = `${getPath()}${suffix}.ref.gz`

  return window.fetch(url)
    .then((response) => {
      // If a data tile fails to fetch, don't immediately reject; instead,
      // resolve with an error object. We'll deal with these later.
      if (!response.ok) {
        console.warn(`[analyst-ui] Unable to fetch a reference speed tile from ${response.url}. The status code given was ${response.status}.`)
        return Promise.resolve({ error: true })
      }

      return response.arrayBuffer()
        // Read protobuf message and convert to plain object
        .then(readDataTiles)
        // We only want the child data object
        .then(protobufMessage => protobufMessage.subtiles[0])
    })
}
