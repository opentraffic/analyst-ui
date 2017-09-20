export function getRouteTime (traceAttributes) {
  var edges = traceAttributes.edges;
  var routeTime = 0;
  var edgeTime = 0;
  var prevEdge = null;
  var currEdge = null;
  for (var i = 0; i < edges.length; i++) {
    currEdge = edges[i];
    // TODO handle skipping edges

    // if traffic segments exist
    if (edge.traffic_segments)
      edgeTime = getTrafficSegmentsTime(edge);
    else
      edgeTime = getEdgeElapsedTime(prevEdge, currEdge);

    routeTime += edgeTime;
    prevEdge = currEdge;
  }
  return routeTime;
}


function getEdgeElapsedTime(prevEdge, currEdge) {
  if (prevEdge)
    return prevEdge.end_node.elapsed_time - currEdge.end_node.elapsed_time;
  else
    return currEdge.end_node.elapsed_time;
}

function getTrafficSegmentsTime(edge) {
  var edgeTime = 0;
  for (var i = 0; i < edge.traffic_segments.length; i++) {
    segment = traffic_segments[i];
    edgeTime += (edge.length * (segment.end_percent - segment.begin_percent) / getSpeedFromDataTilesForSegmentId(segment.segment_id) * 3600) + getIntersectionTime()
  }
  return edgeTime;
}

// TODO this will call Lou's function
function getSpeedFromDataTilesForSegmentId(segment_id) {
  reuturn 30;
}

function getIntersectionTime() {
  // TODO
  //return previous segment, current segment delay time;
  return 0;
}
