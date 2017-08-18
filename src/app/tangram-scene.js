/* global __webpack_require__ */
/* global feature */
import config from '../config'
import { speedRamp, getSpeedColor } from '../lib/color-ramps'

const scene = {
  import: [
    'https://mapzen.com/carto/refill-style/7/refill-style.zip',
    'https://mapzen.com/carto/refill-style/7/themes/gray.zip'
    // 'https://mapzen.com/carto/refill-style/7/themes/gray-gold.zip'
  ],
  global: {
    'sdk_mapzen_api_key': config.mapzen.apiKey
  },
  layers: {
    routes: {
      data: { source: 'routes' },
      draw: {
        lines: {
          order: 500,
          width: '2px',
          color: function() {
            var speed = feature.speed
            var color = speed >= 70 ? '#313695' :
                        speed >= 65 ? '#4575b4' :
                        speed >= 60 ? '#74add1' :
                        speed >= 55 ? '#abd9e9' :
                        speed >= 50 ? '#e0f3f8' :
                        speed >= 45 ? '#fee090' :
                        speed >= 40 ? '#fdae61' :
                        speed >= 35 ? '#f46d43' :
                        speed >= 30 ? '#d73027' :
                        speed >= 0 ? '#a50026' :
                        '#ccc'
            return color
            //return getSpeedColor(speed)
          }
        }
      }
    }
  }
}

export function getInitialTangramScene () {
  return scene
}
