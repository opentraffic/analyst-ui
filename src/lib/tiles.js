/**
 * OSMLR tile utilities
 */
import { filter } from 'lodash'
import bigInt from 'big-integer'

const VALHALLA_TILES = [
  { level: 2, size: 0.25 },
  { level: 1, size: 1.0 },
  { level: 0, size: 4.0 }
]

/**
 * Given a bounding box, returns an array of tuples of OSMLR tiles that
 * intersect the bounding box, where the first item in the tuple is the tile
 * level and the second item in the tuple is the tile's index
 *
 * @param {Number} left - western (minimum) longitude
 * @param {Number} bottom - southern (minimum) latitude
 * @param {Number} right - eastern (maximum) longitude
 * @param {Number} top - northern (maximum) latitude
 * @returns {Array} - of OSMLR tuples [tile level, tile index]
 */
export function getTilesForBbox (left, bottom, right, top) {
  // if this is crossing the anti meridian split it up and combine
  if (left > right) {
    const east = getTilesForBbox(left, bottom, 180.0, top)
    const west = getTilesForBbox(-180.0, bottom, right, top)
    return east.concat(west)
  }

  // move these so we can compute percentages
  left += 180
  right += 180
  bottom += 90
  top += 90

  // for each size of tile
  return VALHALLA_TILES.reduce(function (tiles, tileSet) {
    const set = []

    // for each column
    for (let x = Math.floor(left / tileSet.size); x <= Math.floor(right / tileSet.size); x++) {
      // for each row
      for (let y = Math.floor(bottom / tileSet.size); y <= Math.floor(top / tileSet.size); y++) {
        // give back the level and the tile index
        set.push([ tileSet.level, Math.floor(y * (360.0 / tileSet.size) + x) ])
      }
    }

    return tiles.concat(set)
  }, [])
}

/**
 * Creates a buffer around the given bounding box and calls getTilesForBbox()
 * with the new bounds.
 *
 * Rationale: OSMLR segments are not duplicated in adjacent tiles even if they cross
 * a tile boundary. An OSMLR segment exists in a tile if its start point is inside
 * the tile, and it is allowed to cross the tile and end outside of the tile.
 * For that reason it is possible to have a requested bounding box align with a
 * tile boundary such that a segment that would normally intersect it isn't
 * actually present in the tile. By extending the buffer, we can make sure these
 * segments are captured. Thankfully the segments are quite short and only a very
 * small buffer is needed.
 */
export function getTilesForBufferedBbox (left, bottom, right, top, buffer = 0.1) {
  return getTilesForBbox(left - buffer, bottom - buffer, right + buffer, top + buffer)
}

/**
 * Given an OSMLR id, convert it to the appropriate directory/file scheme.
 *
 * @todo Handle improper tile levels or ids.
 * @param {Number} level - tile level (0-2).
 * @param {Number} tileId - tile index.
 * - or -
 * @param {Array} tuple - an array of two values: [ level, tileId ]
 *          See the return value for getTilesForBbox()
 * - or -
 * @param {Object} parsedSegmentId - an object of shape { level, tile, segment }
 *
 * @todo standardize on one form?!
 *
 * @returns {string} urlSuffix - a string for the directory/file.
 */
export function getTileUrlSuffix (arg1, arg2) {
  function getTileLevel (arg) {
    if (Array.isArray(arg)) {
      return arg[0]
    } else if (typeof arg === 'object' && arg !== null) {
      return arg.level
    } else {
      return arg
    }
  }

  function getTileIndex (arg) {
    if (Array.isArray(arg)) {
      return arg[1]
    } else if (typeof arg === 'object' && arg !== null) {
      return arg.tile
    } else {
      return arg
    }
  }

  const level = getTileLevel(arg1)
  const id = getTileIndex(arg2 || arg1)

  // Get the right tileset definition for the level we want
  const tileSet = filter(VALHALLA_TILES, { level })[0]

  // Get the maximum tile id for that tileset
  const maxId = (360.0 / tileSet.size * 180.0 / tileSet.size) - 1

  // Get the number of directories, we need 3 digits per directory
  const numDirs = Math.ceil(maxId.toString().length / 3)

  // Zero pad the string of the number so it has the proper amount of digits
  let suffix = id.toString().padStart(3 * numDirs, 0)

  // Add directory separators
  const temp = []

  while (suffix.length) {
    var part = suffix.substr(0, 3)
    temp.push(part)
    suffix = suffix.substr(3)
  }

  return level + '/' + temp.join('/')
}

const LEVEL_BITS = 3
const TILE_INDEX_BITS = 22
const SEGMENT_INDEX_BITS = 21

const LEVEL_MASK = (2 ** LEVEL_BITS) - 1
const TILE_INDEX_MASK = (2 ** TILE_INDEX_BITS) - 1
const SEGMENT_INDEX_MASK = (2 ** SEGMENT_INDEX_BITS) - 1

/**
 * parses segment ID for level, tile index, and segment index. This ID is
 * greater than the 32-bit number in JavaScript, so a normal right shift
 * operation doesn't work properly. We wrap the id in the bigInt object to
 * get aoround this.
 */
function getLevelFromSegmentId (id) {
  return bigInt(id) & LEVEL_MASK
}

function getTileIndexFromSegmentId (id) {
  return bigInt(id).shiftRight(LEVEL_BITS) & TILE_INDEX_MASK
}

function getSegmentIndexFromSegmentId (id) {
  return bigInt(id).shiftRight(LEVEL_BITS + TILE_INDEX_BITS) & SEGMENT_INDEX_MASK
}

/**
 * Given an segment id from trace_attributes, convert it to reference OSMLR
 * level, tile, and segment indices.
 *
 * @param {Number} id
 * @returns {Object}
 */
export function parseSegmentId (id) {
  return {
    level: getLevelFromSegmentId(id),
    tile: getTileIndexFromSegmentId(id),
    segment: getSegmentIndexFromSegmentId(id)
  }
}
