export const speedRamp = [
  {
    color: '#a50026',
    minValue: 0,
    label: 'Less than 20'
  },
  {
    color: '#d73027',
    minValue: 20,
    label: '20'
  },
  {
    color: '#f46d43',
    minValue: 30,
    label: '30'
  },
  {
    color: '#fdae61',
    minValue: 40,
    label: '40'
  },
  {
    color: '#fee090',
    minValue: 50,
    label: '50'
  },
  {
    color: '#e0f3f8',
    minValue: 60,
    label: '60'
  },
  {
    color: '#abd9e9',
    minValue: 70,
    label: '70'
  },
  {
    color: '#74add1',
    minValue: 80,
    label: '80'
  },
  {
    color: '#4575b4',
    minValue: 90,
    label: '90'
  },
  {
    color: '#313695',
    minValue: 100,
    label: 'Greater than 100'
  }
]

console.log(speedRamp)

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
  if (value >= 100) return speedRamp[9].color
  else if (value >= 90) return speedRamp[8].color
  else if (value >= 80) return speedRamp[7].color
  else if (value >= 70) return speedRamp[6].color
  else if (value >= 60) return speedRamp[5].color
  else if (value >= 50) return speedRamp[4].color
  else if (value >= 40) return speedRamp[3].color
  else if (value >= 30) return speedRamp[2].color
  else if (value >= 20) return speedRamp[1].color
  else return speedRamp[0].color
}
