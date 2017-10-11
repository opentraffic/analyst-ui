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
<<<<<<< HEAD
  historicSpeedTileUrl: 'https://speedtiles-dev.s3-accelerate.amazonaws.com/',
  nextSegmentTileUrl: 'https://speedtiles-dev.s3-accelerate.amazonaws.com/',
  refSpeedTileUrl: 'https://referencetiles-dev.s3-accelerate.amazonaws.com/',
  valhallaHost: 'routing-dev.opentraffic.io',
  dataGeojson: 'https://s3.amazonaws.com/referencetiles-prod/coverage_map.geojson'
=======
  historicSpeedTileUrl: 'https://speedtiles-prod.s3-accelerate.amazonaws.com/',
  nextSegmentTileUrl: 'https://speedtiles-prod.s3-accelerate.amazonaws.com/',
  refSpeedTileUrl: 'https://referencetiles-prod.s3-accelerate.amazonaws.com/',
  valhallaHost: 'routing-prod.opentraffic.io'
>>>>>>> 0eae786493804cea0ad92fabd1674b067b671f1b
}

export default config
