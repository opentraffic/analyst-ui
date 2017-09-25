import { getSpeedFromDataTilesForSegmentId, getNextSegmentDelayFromDataTiles } from './processing'

export function getRouteTime (traceAttributes) {
  var edges = traceAttributes.edges
  var routeTime = 0
  var prevEdge = null
  var currEdge = null
  for (var i = 0; i < edges.length; i++) {
    var edgeTime = 0
    currEdge = edges[i]

    // Skip edge if internal, roundabout, or turn channel
    if (edgeHasTrafficInfo(prevEdge) &&
        (currEdge.internal_intersection || currEdge.roundabout || (currEdge.use === 'turn_channel'))) {
      for (var j = i + 1; j < edges.length; j++) {
        var tempEdge = edges[j]
        if (edgeHasTrafficInfo(tempEdge) && validIntersectionTime(prevEdge, tempEdge)) {
          currEdge = tempEdge
          i = j
          break
        }
      }
    }

    // if traffic segments exist
    if (edgeHasTrafficInfo(currEdge)) {
      edgeTime = getTrafficSegmentsTime(currEdge)
      edgeTime += getIntersectionTime(prevEdge, currEdge)
    } else {
      edgeTime = getEdgeElapsedTime(prevEdge, currEdge)
    }

    routeTime += edgeTime
    prevEdge = currEdge
  }
  return routeTime
}

export function getEdgeElapsedTime (prevEdge, currEdge) {
  if (prevEdge) {
    return currEdge.end_node.elapsed_time - prevEdge.end_node.elapsed_time
  } else {
    return currEdge.end_node.elapsed_time
  }
}

function getTrafficSegmentsTime (edge) {
  var edgeTime = 0
  var segment
  var prevSegment = null
  for (var i = 0; i < edge.traffic_segments.length; i++) {
    segment = edge.traffic_segments[i]
    edgeTime += (edge.length * (segment.end_percent - segment.begin_percent) / getSpeedFromDataTilesForSegmentId(segment.segment_id) * 3600)
    if (prevSegment) {
      edgeTime += getNextSegmentDelayFromDataTiles(prevSegment.segment_id, segment.segment_id)
    }
    prevSegment = segment
  }
  return edgeTime
}

function getIntersectionTime (prevEdge, currEdge) {
  if (edgeHasTrafficInfo(prevEdge) && edgeHasTrafficInfo(currEdge)) {
    return getNextSegmentDelayFromDataTiles(
      prevEdge.traffic_segments[prevEdge.traffic_segments.length - 1].segment_id,
      currEdge.traffic_segments[0].segment_id)
  }
  return 0
}

function validIntersectionTime (prevEdge, currEdge) {
  if (edgeHasTrafficInfo(prevEdge) && edgeHasTrafficInfo(currEdge) &&
      (getNextSegmentDelayFromDataTiles(
        prevEdge.traffic_segments[prevEdge.traffic_segments.length - 1].segment_id,
        currEdge.traffic_segments[0].segment_id) !== null)) {
    return true
  }
  return false
}

function edgeHasTrafficInfo (edge) {
  return (edge && edge.traffic_segments && (edge.traffic_segments.length > 0))
}
