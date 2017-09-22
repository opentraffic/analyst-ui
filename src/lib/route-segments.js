export const STOPS = [[15, '3px'], [17, '4px'], [18, '10px'], [20, '45px']]
export const ZERO_SPEED_STOPS = [[15, '0.5px'], [17, '1px'], [18, '2.5px'], [20, '11.25px']]

// Calculate the slope and y-intercept in order to get linear equation
// Values given as params are (x, y) and (c, d)
export function getLinearValue (x, y, c, d, zoom) {
  // Calculating slope
  const m = (y - d) / (x - c)
  // Calculating y-intercept
  const b = y - (m * x)
  // Getting linear interpolation of zoom value
  const value = (m * zoom) + b
  return value
}

// Replicating how tangram "stops" data structure works
export function getSegmentWidth (zoom, speed) {
  // If speed is zero, use zeroSpeed stops for less weight
  const array = (speed === 0 || speed === null || typeof speed === 'undefined') ? ZERO_SPEED_STOPS : STOPS
  const startValue = array[0]
  const endValue = array[array.length - 1]
  // If zoom values are outside the defined range,
  // then they are capped by highest and lowest values in range
  if (zoom < startValue[0]) {
    return parseFloat(startValue[1])
  } else if (zoom > endValue[0]) {
    return parseFloat(endValue[1])
  }
  // If they are found in range, use second value in pair
  for (let i = 0; i < array.length; i++) {
    if (array[i][0] === zoom) {
      return parseFloat(array[i][1])
    } else if (zoom < array[i][0]) {
      // If they are intermediate zoom levels, interpolate values
      const x = array[i][0]
      const y = parseFloat(array[i][1])
      const c = array[i - 1][0]
      const d = parseFloat(array[i - 1][1])
      return getLinearValue(x, y, c, d, zoom)
    }
  }
}
