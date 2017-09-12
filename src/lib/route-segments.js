const stops = [[13, '1px'], [15, '2px'], [17, '4px'], [18, '10px'], [20, '45px']]

export default stops

// Calculate the slope and y-intercept in order to get linear equation
// Values given as params are (x, y) and (c, d)
function getLinearValue (x, y, c, d, zoom) {
  // Calculating slope
  const m = (y - d) / (x - c)
  // Calculating y-intercept
  const b = y - (m * x)
  // Getting linear interpolation of zoom value
  const value = (m * zoom) + b
  return value
}

// Replicating how tangram "stops" data structure works
export function getSegmentWidth (zoom) {
  const startValue = stops[0]
  const endValue = stops[stops.length - 1]
  // If zoom values are outside the defined range,
  // then they are capped by highest and lowest values in range
  if (zoom < startValue[0]) return Number(startValue[1].slice(0, -2))
  else if (zoom > endValue[0]) return Number(endValue[1].slice(0, -2))
  // If they are found in range, use second value in pair
  for (let i = 0; i < stops.length; i++) {
    if (stops[i][0] === zoom) return Number(stops[i][1].slice(0, -2))
    // If they are intermediate zoom levels, interpolate values
    else if (zoom < stops[i][0]) {
      const x = stops[i][0]
      const y = Number(stops[i][1].slice(0, -2))
      const c = stops[i - 1][0]
      const d = Number(stops[i - 1][1].slice(0, -2))
      return getLinearValue(x, y, c, d, zoom)
    }
  }
}
