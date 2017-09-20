//for each edge
routeAttributesResp.edges.ForEach(function eta(edge, index)) {
  var next_edge = null;
  var routeTime = 0;
  
  //if previous edge has traffic segments AND current edge is internal, turn lane, or roundabout
  if (edge.traffic_segments && (routeAttributesResp.edges[index+1].internal_intersection || routeAttributesResp.edges[index+1].use(turn_channel) ||  routeAttributesResp.edges[index+1].roundabout)){
    //increment current edge to find next edge with subsequent traffic segments;
    while (next_edge == null && index <= routeAttributesResp.edges.size())
      next_edge = routeAttributesResp.edges[index++].traffic_segments;
    
    //if not able to find next edge with subsequent traffic segments
    //Reset current edge to previous edge + 1
    if (next_edge == null)
      routeAttributesResp.edges[index+1] == edge.traffic_segments + 1;
    }
  }
  //if traffic segments exist
  if (edge.traffic_segments)
    edgeTime = getTrafficSegmentsTime(edge.traffic_segments);
  else
    edgeTime = (index+1) < routeAttributesResp.edges.length ? (getCurrentEdgeElapsedTimeAtEndNode(edge) - getPreviousEdgeElapsedTimeAtEndNode(routeAttributesResp.edges, index)) : 0;
  
  return routeTime += edgeTime;
}

//for each segment
edge.traffic_segments.ForEach(function getTrafficSegmentsTime(segment)) {
  //if valid segment historical data
  if (histSpeed)
    segmentTime = getSegmentHistoricalTime(histSpeed) + getIntersectionTime();
  // else if valid segment reference data
  else if (refSpeed)
    segmentTime = getSegmentReferenceTime(refSpeed) + getIntersectionTime();
  else edgeTime += segmentTime;
  return edgeTime;
}

function getCurrentEdgeElapsedTimeAtEndNode(edges, index) {
  return edges[index+1].end_node.elapsed_time
}

function getPreviousEdgeElapsedTimeAtEndNode(edge) {
  return edge.end_node.elapsed_time;
}

function getSegmentHistoricalTime(histSpeed) {
  return segment length * (segment.end_percent - segment.begin_percent) / (histSpeed * 3600);
}

function getSegmentReferenceTime(refSpeed) {
  return segment length * (segment.end_percent - segment.begin_percent) / (refSpeed * 3600);
}

function getIntersectionTime() {
  return previous segment, current segment delay time;
}

module.exports = eta;

