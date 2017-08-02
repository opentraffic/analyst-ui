import config from '../config'

const scene = {
  import: [
    'https://mapzen.com/carto/refill-style/7/refill-style.zip',
    // 'https://mapzen.com/carto/refill-style/7/themes/gray.zip'
    'https://mapzen.com/carto/refill-style/7/themes/gray-gold.zip'
  ],
  global: {
    'sdk_mapzen_api_key': config.mapzen.apiKey
  }
}

export function getInitialTangramScene () {
  return scene
}
