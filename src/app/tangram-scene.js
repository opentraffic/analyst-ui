import config from '../config'

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
          width: [[13, '1px'], [15, '2px'], [17, '4px'], [18, '10px'], [20, '45px']],
          color: function () {
            /* global feature */
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
      }
    }
  }
}

export function getInitialTangramScene () {
  return scene
}
