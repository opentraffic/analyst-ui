export function getRouteTime (traceAttributes) {
  var edges = traceAttributes.edges
  var routeTime = 0
  var prevEdge = null
  var currEdge = null
  for (var i = 0; i < edges.length; i++) {
    var edgeTime = 0
    currEdge = edges[i]
    // TODO handle skipping edges

    // if traffic segments exist
    if (currEdge.traffic_segments) {
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

function getEdgeElapsedTime (prevEdge, currEdge) {
  if (prevEdge) {
    return prevEdge.end_node.elapsed_time - currEdge.end_node.elapsed_time
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

// TODO this function will be replaced by Lou's function
function getSpeedFromDataTilesForSegmentId (segmentId) {
  return 30
}

// TODO this function will be replaced by Lou's function
function getNextSegmentDelayFromDataTiles (segmentId, nextSegmentId) {
  return 0
}

function getIntersectionTime (prevEdge, currEdge) {
  if (prevEdge && prevEdge.traffic_segments && (prevEdge.traffic_segments.length > 0) &&
      currEdge && currEdge.traffic_segments && (currEdge.traffic_segments.length > 0)) {
    return getNextSegmentDelayFromDataTiles(
      prevEdge.traffic_segments[prevEdge.traffic_segments.length - 1].segment_id,
      currEdge.traffic_segments[0].segment_id)
  }
  return 0
}
