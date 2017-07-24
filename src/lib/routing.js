// expects L.Latlng object
function findClosestRoutePoint (latlng, coordinates) {
  let minDist = Number.MAX_VALUE
  let minIndex, dist

  for (let i = coordinates.length - 1; i >= 0; i--) {
    dist = latlng.distanceTo(coordinates[i])
    if (dist < minDist) {
      minIndex = i
      minDist = dist
    }
  }

  return minIndex
}

function getWaypointIndices (waypoints, coordinates) {
  const indices = []

  for (let i = 0; i < waypoints.length; i++) {
    indices.push(findClosestRoutePoint(waypoints[i], coordinates))
  }

  return indices
}

function findNearestWpBefore (i, waypoints, coordinates) {
  const wpIndices = getWaypointIndices(waypoints, coordinates)
  let j = wpIndices.length - 1
  while (j >= 0 && wpIndices[j] > i) {
    j--
  }

  return j
}

export function getNewWaypointPosition (latlng, waypoints, coordinates) {
  const index = findClosestRoutePoint(latlng, coordinates)
  const afterIndex = findNearestWpBefore(index, waypoints, coordinates)
  return afterIndex
}
