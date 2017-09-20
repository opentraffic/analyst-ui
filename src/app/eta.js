//for each edge

function routeTime(routeAttributesResp)) {
  var next_edge = null;
  var routeTime = 0;

  routeAttributesResp.edges.ForEach(edge, index) {
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
    if (edge.traffic_segments) {
      edge.traffic_segments.ForEach(segment, index) {
        speedTile = getSpeedFromDataTilesForSegmentId(edge.traffic_segments[index].segment_id);

       if (speedTile.exists) {
        if (speedTile == 'historical')
          segmentTime = getSegmentHistoricalTime(speedTile.speed) + getIntersectionTime();
        else if (speedTile == 'reference')
          segmentTime = getSegmentReferenceTime(speedTile.speed) + getIntersectionTime();
        edgeTime += segmentTime;
      } else {
          edgeTime = (index+1) < routeAttributesResp.edges.length ? (getCurrentEdgeElapsedTimeAtEndNode(edge) - getPreviousEdgeElapsedTimeAtEndNode(routeAttributesResp.edges, index)) : 0;
      }
    }
  return routeTime += edgeTime;
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

module.exports = routeTime;

