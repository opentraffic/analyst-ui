const config = {
  name: 'OpenTraffic Analyst UI',
  mapzen: {
    apiKey: 'mapzen-YFrX5jt'
  },
  map: {
    center: [0, 120],
    zoom: 3
  },
  osmlrTileUrl: 'https://osmlr-tiles.s3.amazonaws.com/v1.0/geojson/',
  dataGeojson: 'https://s3.amazonaws.com/referencetiles-dev/coverage_map.geojson',
  historicSpeedTileUrl: 'https://speedtiles-dev.s3-accelerate.amazonaws.com/',
  nextSegmentTileUrl: 'https://speedtiles-dev.s3-accelerate.amazonaws.com/',
  refSpeedTileUrl: 'https://referencetiles-dev.s3-accelerate.amazonaws.com/',
  valhallaHost: 'routing-dev.opentraffic.io'
}

export default config
