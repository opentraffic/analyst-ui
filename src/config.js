const config = {
  name: 'Open Traffic Analyst UI',
  mapzen: {
    apiKey: '8f2a0651ebc54366b59183dca4851489'
  },
  map: {
    center: [0, 120],
    zoom: 3
  },
  osmlrTileUrl: './osmlr-tiles/',
  dataGeojson: './coverage.geojson',
  historicSpeedTileUrl: './speedtiles-prod/',
  nextSegmentTileUrl: './speedtiles-prod/',
  refSpeedTileUrl: './referencetiles/',
  valhallaHost: 'localhost:8082'
}

export default config
