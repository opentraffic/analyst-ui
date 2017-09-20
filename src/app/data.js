import protobuf from 'protobufjs'
import { filter, uniq } from 'lodash'
import config from '../config'
import speedTileDescriptor from '../proto/speedtile.proto.json'
import { getTileUrlSuffix } from '../lib/tiles'

const STATIC_DATA_TILE_PATH = config.staticTileUrl
const tileCache = {}

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
  return tiles.reduce((root, tile) => {
    const level = tile.level
    const index = tile.index
    const subtile = tile.startSegmentIndex / tile.subtileSegments
    const type = tile.meta_type

    // Tiles with year / week metadata will also roll up by that
    const year = tile.meta_year || -1
    const week = tile.meta_week || -1

    if (!root[type]) root[type] = {}

    const subroot = root[type]

    if (year !== -1 && week !== -1) {
      if (!subroot[year]) subroot[year] = {}
      if (!subroot[year][week]) subroot[year][week] = {}
      if (!subroot[year][week][level]) subroot[year][week][level] = {}
      if (!subroot[year][week][level][index]) subroot[year][week][level][index] = {}

      subroot[year][week][level][index][subtile] = tile
    } else {
      if (!subroot[level]) subroot[level] = {}
      if (!subroot[level][index]) subroot[level][index] = {}

      subroot[level][index] = tile
    }

    return root
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
 * Fetch one data tile given an id suffix and an optional subtile number
 *
 * @param {string} suffix - file path to data tile
 * @param {Number} subtile - number of subtile to download (default is 0)
 * @param {string} year - the year of data requested, from date picker
 * @param {string} week - the week of data requested, from date picker
 * @returns {Promise} - resolved to either a plain JS object of the data tile,
 *            _or_ an error object { error: true } if it failed. We don't
 *            want this to throw because data tile fetch errors should be
 *            skipped
 */
function fetchHistoricSpeedTile (suffix, subtile = 0, year, week) {
  const url = `${STATIC_DATA_TILE_PATH}${year}/${week}/${suffix}.spd.${subtile}.gz`
  const type = 'historic data tile'

  // Add some metadata to the returned tile
  return fetchDataTile(url, type)
    .then((tile) => {
      tile.meta_year = year
      tile.meta_week = week
      tile.meta_type = 'historic'
      return tile
    })
}

/**
 * Fetch reference speed tile given an id suffix
 *
 * @param {string} suffix - file path to data tile
 * @returns {Promise} - resolved to either a plain JS object of the data tile,
 *            _or_ an error object { error: true } if it failed. We don't
 *            want this to throw because data tile fetch errors should be
 *            skipped
 */
function fetchReferenceSpeedTile (suffix) {
  const url = `${STATIC_DATA_TILE_PATH}${suffix}.ref.gz`
  const type = 'reference speed tile'

  // Add some metadata to the returned tile
  return fetchDataTile(url, type)
    .then((tile) => {
      tile.meta_type = 'reference'
      return tile
    })
}

/**
 * Generic data tile fetch utility function.
 *
 * @param {string} url - file path to data tile
 * @param {string} type - the type of data tile, for logging
 * @returns {Promise} - resolved to either a plain JS object of the data tile,
 *            _or_ an error object { error: true } if it failed. We don't
 *            want this to throw because data tile fetch errors should be
 *            skipped
 */
function fetchDataTile (url, type) {
  return window.fetch(url)
    .then((response) => {
      // If a data tile fails to fetch, don't immediately reject; instead,
      // resolve with an error object. We'll deal with these later.
      if (!response.ok) {
        console.warn(`[analyst-ui] Unable to fetch a ${type} from ${response.url}. The status code given was ${response.status}.`)
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
 * @param {Object} date - date of data to fetch in the format { year, week }
 * @return {Promise} - resolved with an object where tiles with level and
 *            tile index mapped to a nested key structure.
 */
export function fetchDataTiles (ids, date) {
  // Temporary. If tilecache has values, return Promise-resolving as-is.
  if (Object.keys(tileCache).length > 0) {
    return Promise.resolve(tileCache)
  }

  // Get the year and week of data tile to download.
  const year = date.year
  const week = date.week

  // Obtain a list of unique tile suffixes
  const simpleIds = ids.map(id => getTileUrlSuffix({ level: id.level, tile: id.tile }))
  const uniqueIds = uniq(simpleIds)

  // Fetch each suffix at subtile level 0.
  const promises = uniqueIds.map((id) => fetchHistoricSpeedTile(id, 0, year, week))

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
          toDownload.push(fetchHistoricSpeedTile(suffix, i, year, week))
        }

        // Get reference speed tile
        toDownload.push(fetchReferenceSpeedTile(suffix))

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
