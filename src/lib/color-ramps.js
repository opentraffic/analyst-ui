import colorbrewer from 'colorbrewer'
import store from '../store'

const BLANK_COLOR = '#ccc'
const CB_RDYLBU10 = colorbrewer.RdYlBu[10]
const CB_REDS5 = colorbrewer.Reds[5]
const CB_BLUES5 = colorbrewer.Blues[5]

export const percDiffRamp = [
  {
    color: CB_REDS5[4],
    minValue: -50,
    label: 'Greater than -40%'
  },
  {
    color: CB_REDS5[3],
    minValue: -40,
    label: '-30%'
  },
  {
    color: CB_REDS5[2],
    minValue: -30,
    label: '-20%'
  },
  {
    color: CB_REDS5[1],
    minValue: -20,
    label: '-10%'
  },
  {
    color: CB_REDS5[0],
    minValue: -10,
    label: '-0%'
  },
  {
    color: CB_BLUES5[0],
    minValue: 0,
    label: '+0%'
  },
  {
    color: CB_BLUES5[1],
    minValue: 10,
    label: '+10%'
  },
  {
    color: CB_BLUES5[2],
    minValue: 20,
    label: '+20%'
  },
  {
    color: CB_BLUES5[3],
    minValue: 30,
    label: '+30%'
  },
  {
    color: CB_BLUES5[4],
    minValue: 40,
    label: 'Greater than +40%'
  }
]

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
  const { refSpeedComparisonEnabled } = store.getState().app
  // use percDiffRamp if refSpeedComparisonEnabled = true
  const colorRamp = (refSpeedComparisonEnabled) ? percDiffRamp : speedRamp
  for (let i = colorRamp.length - 1; i >= 0; i--) {
    if (value >= colorRamp[i].minValue) {
      return colorRamp[i].color
    }
  }

  return BLANK_COLOR
}

export function getColorAtIndexInVec3 (index) {
  function hexToRgb (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b
    })

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // { r, g, b } --> '0., 0., 0.'
  function rgbToVec3String (rgb) {
    const values = []
    values.push((rgb.r / 255).toFixed(3))
    values.push((rgb.g / 255).toFixed(3))
    values.push((rgb.b / 255).toFixed(3))
    return values.join(', ')
  }

  function hexToVec3 (hex) {
    return rgbToVec3String(hexToRgb(hex))
  }

  // index = 0
  if (!index) return hexToVec3(BLANK_COLOR)

  // index is 1-indexed
  return hexToVec3(speedRamp[index - 1].color)
}
