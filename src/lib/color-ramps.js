/**
 * Returns a hex color value given a speed value. Based on the same speed
 * color ramp from Mapzen Mobility Explorer
 * https://github.com/mapzen/mobility-explorer/blob/master/app/map-matching/controller.js
 *
 * @param {Number} value
 * @return {String} color - a CSS color
 */
export function getSpeedColor (value) {
  if (!value) return '#ccc' // Lack of value takes on this placeholder color
  if (value >= 70) return '#313695'
  else if (value >= 65) return '#4575b4'
  else if (value >= 60) return '#74add1'
  else if (value >= 55) return '#abd9e9'
  else if (value >= 50) return '#e0f3f8'
  else if (value >= 45) return '#fee090'
  else if (value >= 40) return '#fdae61'
  else if (value >= 35) return '#f46d43'
  else if (value >= 30) return '#d73027'
  else return '#a50026'
}
