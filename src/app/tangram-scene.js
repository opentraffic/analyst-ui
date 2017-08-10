import config from '../config'

const scene = {
  import: [
    'https://mapzen.com/carto/refill-style/7/refill-style.zip',
    // 'https://mapzen.com/carto/refill-style/7/themes/gray.zip'
    'https://mapzen.com/carto/refill-style/7/themes/gray-gold.zip'
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
          color: 'red',
          width: '2px'
        }
      }
    }
  }
}

export function getInitialTangramScene () {
  return scene
}
