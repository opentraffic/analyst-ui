import colorbrewer from 'colorbrewer'

const BLANK_COLOR = '#ccc'
const CB_RDYLBU10 = colorbrewer.RdYlBu[10]

export const speedRamp = [
  {
    color: CB_RDYLBU10[0],
    minValue: 0,
    label: 'Less than 20'
  },
  {
    color: CB_RDYLBU10[1],
    minValue: 20,
    label: '20'
  },
  {
    color: CB_RDYLBU10[2],
    minValue: 30,
    label: '30'
  },
  {
    color: CB_RDYLBU10[3],
    minValue: 40,
    label: '40'
  },
  {
    color: CB_RDYLBU10[4],
    minValue: 50,
    label: '50'
  },
  {
    color: CB_RDYLBU10[5],
    minValue: 60,
    label: '60'
  },
  {
    color: CB_RDYLBU10[6],
    minValue: 70,
    label: '70'
  },
  {
    color: CB_RDYLBU10[7],
    minValue: 80,
    label: '80'
  },
  {
    color: CB_RDYLBU10[8],
    minValue: 90,
    label: '90'
  },
  {
    color: CB_RDYLBU10[9],
    minValue: 100,
    label: 'Greater than 100'
  }
]

/**
 * Returns a hex color value given a speed value. Based on color ramp from
 * colorbrewer: http://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=10
 *
 * @param {Number} value
 * @return {String} color - a CSS color
 */
export function getSpeedColor (value) {
  if (!value) return BLANK_COLOR

  for (let i = speedRamp.length - 1; i >= 0; i--) {
    if (value >= speedRamp[i].minValue) {
      return speedRamp[i].color
    }
  }

  return BLANK_COLOR
}
