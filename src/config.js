const config = {
  name: 'Open Traffic Analyst UI',
  mapzen: {
    apiKey: '8f2a0651ebc54366b59183dca4851489'
  },
  map: {
    center: [0, 120],
    zoom: 3
  },
  osmlrTileUrl: 'https://wbg-osmlr-tiles.s3.amazonaws.com/v1.1/geojson/',
  dataGeojson: 'https://stvno.github.io/wereldbank/coverage.geojson',
  historicSpeedTileUrl: 'https://wbg-speedtiles-prod.s3.amazonaws.com/',
  nextSegmentTileUrl: 'https://wbg-speedtiles-prod.s3.amazonaws.com/',
  refSpeedTileUrl: 'https://wbg-referencetiles-prod.s3.amazonaws.com/',
  valhallaHost: 'routing-v1-1.opentraffic.io'
}

export default config
