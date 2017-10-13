import { getSpeedFromDataTilesForSegmentId, getNextSegmentDelayFromDataTiles } from './processing'
import { getLevelFromSegmentId } from '../lib/tiles'

/**
 * Returns the route time in seconds for the specified traceAttributes object.
 * The route time will use the time based on historic traffic if a traffic segment
 * exists, otherwise it will use the time based on OSM speed limit or road
 * classification.
 *
 * @param {object} traceAttributes - detailed attribution along a route.
 * @return route time in seconds
 */
export function getRouteTime (traceAttributes) {
  var edges = traceAttributes.edges
  var routeTime = 0
  var prevEdge = null
  var currEdge = null
  for (var i = 0; i < edges.length; i++) {
    var edgeTime = null
    currEdge = edges[i]

    // Skip edge if internal, roundabout, or turn channel
    if (edgeHasTrafficInfo(prevEdge) &&
        (currEdge.internal_intersection || currEdge.roundabout || (currEdge.use === 'turn_channel'))) {
      for (var j = i + 1; j < edges.length; j++) {
        var tempEdge = edges[j]
        // Skip any subsequent internal, roundabout, or turn channel edges
        if (tempEdge.internal_intersection || tempEdge.roundabout || (tempEdge.use === 'turn_channel')) {
          continue
        }
        // If valid intersection time is found then update the current edge and index and exit loop
        if (edgeHasTrafficInfo(tempEdge) && validIntersectionTime(prevEdge, tempEdge)) {
          currEdge = tempEdge
          i = j
          break
        }
        // Not found - exit loop
        break
      }
    }

    // if traffic segments exist get the traffic segment time
    if (edgeHasTrafficInfo(currEdge)) {
      edgeTime = getTrafficSegmentsTime(currEdge)
    }

    // if valid traffic edge time then use it, otherwise use elapsed time
    if (edgeTime !== null) {
      edgeTime += getIntersectionTime(prevEdge, currEdge)
    } else {
      edgeTime = getEdgeElapsedTime(prevEdge, currEdge)
    }

    routeTime += edgeTime
    prevEdge = currEdge
  }
  return routeTime
}

/**
 * Returns the route time in seconds for the specified current edge.
 * The edge time will use the time based on OSM speed limit or road
 * classification.
 *
 * @param {object} prevEdge - the previous edge to the targeted edge.
 * @param {object} currEdge - the target edge for the requested time.
 * @return edge time in seconds
 */
export function getEdgeElapsedTime (prevEdge, currEdge) {
  if (prevEdge) {
    return currEdge.end_node.elapsed_time - prevEdge.end_node.elapsed_time
  } else {
    return currEdge.end_node.elapsed_time
  }
}

/**
 * Returns the time in seconds based on historic traffic for the specified edge.
 *
 * @param {object} edge - the target edge for the requested time.
 * @return edge time in seconds
 */
function getTrafficSegmentsTime (edge) {
  var edgeTime = 0
  var speed = 0
  var segment
  var prevSegment = null
  for (var i = 0; i < edge.traffic_segments.length; i++) {
    segment = edge.traffic_segments[i]
    speed = getSpeedFromDataTilesForSegmentId(segment.segment_id)

    if (speed !== null) {
      edgeTime += (edge.length * (segment.end_percent - segment.begin_percent) / speed * 3600)

      if (prevSegment) {
        var delay = getNextSegmentDelayFromDataTiles(prevSegment.segment_id, segment.segment_id)

        if (delay !== null) {
          edgeTime += delay
        }
      }
    } else {
      // Invalid speed return null
      return null
    }
    prevSegment = segment
  }
  return edgeTime
}

/**
 * Returns the intersection time in seconds based on historic traffic to travel
 * from the specified previous edge to the specified current edge.
 *
 * @param {object} prevEdge - the from edge.
 * @param {object} currEdge - the to edge.
 * @return intersection time in seconds
 */
function getIntersectionTime (prevEdge, currEdge) {
  var intersectionTime = 0
  if (edgeHasTrafficInfo(prevEdge) && edgeHasTrafficInfo(currEdge)) {
    intersectionTime = getNextSegmentDelayFromDataTiles(
      prevEdge.traffic_segments[prevEdge.traffic_segments.length - 1].segment_id,
      currEdge.traffic_segments[0].segment_id)
    if (intersectionTime === null) {
      intersectionTime = 0
    }
  }
  return intersectionTime
}

/**
 * Returns true if a valid intersection time exists between the
 * specified previous edge to the specified current edge, false otherwise.
 *
 * @param {object} prevEdge - the from edge.
 * @param {object} currEdge - the to edge.
 * @return true if a valid intersection time exists between the
 * specified previous edge to the specified current edge, false otherwise.
 */
function validIntersectionTime (prevEdge, currEdge) {
  if (edgeHasTrafficInfo(prevEdge) && edgeHasTrafficInfo(currEdge) &&
      (getNextSegmentDelayFromDataTiles(
        prevEdge.traffic_segments[prevEdge.traffic_segments.length - 1].segment_id,
        currEdge.traffic_segments[0].segment_id) !== null)) {
    return true
  }
  return false
}

/**
 * Returns true if the specified edge has traffic information, false otherwise.
 *
 * @param {object} edge - the edge to check for traffic information.
 * @return true if the specified edge has traffic information, false otherwise.
 */
function edgeHasTrafficInfo (edge) {
  return (edge && edge.traffic_segments && (edge.traffic_segments.length > 0) &&
    (getLevelFromSegmentId(edge.traffic_segments[0].segment_id) < 2))
}
