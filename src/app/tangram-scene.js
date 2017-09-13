/* global feature */
import config from '../config'
import { STOPS, ZERO_SPEED_STOPS } from '../lib/route-segments'

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
          width: STOPS,
          color: function () {
            const speed = feature.speed
            const color = speed >= 100 ? '#313695'
                        : speed >= 90 ? '#4575b4'
                        : speed >= 80 ? '#74add1'
                        : speed >= 70 ? '#abd9e9'
                        : speed >= 60 ? '#e0f3f8'
                        : speed >= 50 ? '#fee090'
                        : speed >= 40 ? '#fdae61'
                        : speed >= 30 ? '#f46d43'
                        : speed >= 20 ? '#d73027'
                        : speed > 0 ? '#a50026'
                        : '#ccc'
            return color
          },
          outline: {
            width: '1px',
            color: '#222'
          },
          join: 'round'
        }
      },
      zeroSpeed: {
        filter: function () {
          return feature.speed === 0 || feature.speed === null
        },
        draw: {
          lines: {
            order: 400,
            width: ZERO_SPEED_STOPS
          }
        }
      }
    }
  }
}

export function getInitialTangramScene () {
  return scene
}
