import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEqual, reject, uniq } from 'lodash'
import Map from './Map'
import MapSearchBar from './MapSearchBar'
import Route from './Map/Route'
import RouteError from './Map/RouteError'
import { getRoute, getTraceAttributes, valhallaResponseToPolylineCoordinates } from '../lib/valhalla'
import { getTilesForBbox, getTileUrlSuffix, parseSegmentId } from '../lib/tiles'
import { merge } from '../lib/geojson'
import * as mapActionCreators from '../store/actions/map'
import * as routeActionCreators from '../store/actions/route'
import { updateScene } from '../store/actions/tangram'
import { drawBounds } from '../app/region-bounds'
import { getSpeedTiles } from '../app/data'
import { setDataSource } from '../lib/tangram'

class MapContainer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    config: PropTypes.object,
    route: PropTypes.object,
    map: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.showRoute()

    this.onClick = this.onClick.bind(this)
    this.onClickDismissErrors = this.onClickDismissErrors.bind(this)
  }

  componentDidMount () {
    if (this.props.bounds) {
      drawBounds(this.props.bounds)
    }
  }

  componentDidUpdate (prevProps) {
    if (isEqual(prevProps.route.waypoints, this.props.route.waypoints)) return

    this.showRoute()
  }

  onClick (event) {
    // Only add waypoint when the original map canvas is clicked. This prevents
    // a bug where clicking a polyline and then adding a marker causes another
    // onClick to fire in the wrong place.
    if (event.originalEvent.target.tagName === 'CANVAS') {
      if (this.props.mode !== 'ROUTE') return

      this.props.addWaypoint(event.latlng)
    }
  }

  showRoute () {
    const host = 'routing-prod.opentraffic.io'
    const waypoints = this.props.route.waypoints

    if (waypoints.length <= 1) {
      // TODO: probably not the best place to do this
      this.props.clearRoute()
      this.props.clearRouteError()
      return
    }

    // Get tiles (experimental)
    const STATIC_DATA_TILE_PATH = 'https://s3.amazonaws.com/speed-extracts/2017/0/'
    // Local web server for files will gzip automatically.
    // const STATIC_DATA_TILE_PATH = '/sample-tiles/'
    // https://s3.amazonaws.com/speed-extracts/2017/0/0/002/415.spd.0.gz',

    const OSMLR_TILE_PATH = 'https://osmlr-tiles.s3.amazonaws.com/v0.1/geojson/'

    getRoute(host, waypoints)
      .then(response => {
        // Transform Valhalla response to polyline coordinates and send to map
        const coordinates = valhallaResponseToPolylineCoordinates(response)
        this.props.setRoute(coordinates)

        // Get bounding box for OSMLR tiles
        const bounds = response.trip.summary
        const tiles = getTilesForBbox(bounds.min_lon, bounds.min_lat, bounds.max_lon, bounds.max_lat)

        // For now, reject tiles at level 2
        const downloadTiles = reject(tiles, (i) => i[0] === 2)
        const tileUrls = downloadTiles.map(i => `${STATIC_DATA_TILE_PATH}${getTileUrlSuffix(i)}.spd.0.gz`)
        console.log(tileUrls)
        // const promises = tileUrls.map(url => fetch(url)
        //   .then(res => res.json())
        //   .catch(e => console.log(e)))
        //
        // Promise.all(promises).then(results => {
        //   console.log(results)
        // })

        return coordinates
      })
      .then(coordinates => {
        // Experimental.
        return getTraceAttributes(host, coordinates)
      })
      // Put this here to only catch errors in fetch
      .catch(error => {
        let message
        if (typeof error === 'object' && error.error) {
          message = error.error
        } else {
          message = error
        }
        this.props.setRouteError(message)
      })
      // Do stuff with trace_attributes. TEST!
      .then(response => {
        // console.log(response)
        const segments = []
        const segmentIds = []

        response.edges.forEach(edge => {
          // it is possible for an edge not to have traffic_segments
          if (edge.traffic_segments) {
            edge.traffic_segments.forEach(segment => {
              segments.push(segment)
              segmentIds.push(segment.segment_id)
            })
          }
        })

        // It is possible for multiple edges to have the same segmentId, so
        // collapse all segmentIds
        const parsedIds = uniq(segmentIds).map(parseSegmentId)

        // todo: reject any segments at level 2, but right now, assume they
        // are already not included.
        const suffixes = parsedIds.map(getTileUrlSuffix)
        // Remove all duplicate suffixes
        // const urls = suffixes.map(suffix => `${STATIC_DATA_TILE_PATH}${suffix}.spd.0.gz`)
        const urls = ['https://s3.amazonaws.com/speed-extracts/2017/0/0/002/415.spd.0.gz']

        // console.log(parsedIds)

        getSpeedTiles(urls)
          .then((tiles) => {
            parsedIds.forEach(item => {
              // not all levels and tiles are available yet, so try()
              // skips it if it doesn't work
              try {
                const segmentId = item.segment
                const subtiles = tiles[item.level][item.tile] // array
                // find which subtile contains this segment id
                for (let i = 0, j = subtiles.length; i < j; i++) {
                  const tile = subtiles[i]
                  const upperBounds = (i === j - 1) ? tile.totalSegments : (tile.startSegmentIndex + tile.subtileSegments)
                  if (segmentId > tile.startSegmentIndex && segmentId <= upperBounds) {
                    item.referenceSpeed = tile.referenceSpeeds[segmentId % tile.subtileSegments]
                    break
                  }
                }
              } catch (e) {}
            })
            console.log(JSON.stringify(parsedIds))
          })
          .catch((error) => {
            console.log('[getSpeedTiles error]', error)
          })

        // Note: determining tiles this way based on only the route is more
        // efficient because it means we download the minimum required tiles.
        // Based only on rectangular bounds, a 45-degree angle kind of route,
        // or a route that travels only on level 0 roads, will download more
        // tiles than we actually need. This helps save on bandwidth and
        // memory for qualifying requests.
        // const promises = urls.map(url => fetch(url)
        //   .then(res => res.json())
        //   .catch(e => console.log(e)))
        //
        // Promise.all(promises).then(results => {
        //   // results is an array of all response objects.
        //   segmentIds.forEach(id => {
        //     // console.log(id.toString())
        //     // console.log(results[0].segments[id.toString()])
        //   })
        //   // console.log(segmentIds)
        //   // console.log(Object.keys(results[0].segments)) // ['205655133048']
        //   // console.log(results[0].segments['849766009720'])
        // })

        /**
         * Fetch requested OSMLR geometry tiles and return its result as a
         * single GeoJSON file.
         *
         * @param {Array<String>} suffixes - an array of tile path suffixes,
         *            in the form of `x/xxx/xxx`.
         * @return {Promise} - a Promise is returned passing the value of all
         *            OSMLR geometry tiles, merged into a single GeoJSON.
         */
        function fetchOSMLRGeometryTiles (suffixes) {
          const urls = suffixes.map(suffix => `${OSMLR_TILE_PATH}${suffix}.json`)
          const fetchTiles = urls.map(url => fetch(url).then(res => res.json()))

          // Results is an array of all GeoJSON tiles. Next, merge into one file
          // and return the result as a single GeoJSON.
          return Promise.all(fetchTiles).then(merge)
        }

        fetchOSMLRGeometryTiles(suffixes).then((geo) => {
          setDataSource('routes', { type: 'GeoJSON', data: geo })

          // lets see if we can find the segmentId as osmlr_id
          const features = geo.features
          let found = false
          for (let i = 0, j = features.length; i < j; i++) {
            // This property is a number, not a string
            if (features[i].properties.osmlr_id === 849766009720) {
              // console.log(features[i])
              found = true
              break
            }
          }
          if (found === false) {
            console.log('not found')
          }
        })
      })
  }

  onClickDismissErrors () {
    this.props.clearRouteError()
  }

  render () {
    const config = this.props.config
    const map = this.props.map

    return (
      <div className={this.props.className}>
        <MapSearchBar
          config={config}
          setLocation={this.props.setLocation}
          clearLabel={this.props.clearLabel}
          recenterMap={this.props.recenterMap}
        />
        <Map
          center={map.coordinates}
          zoom={map.zoom}
          onClick={this.onClick}
          recenterMap={this.props.recenterMap}
          scene={this.props.scene}
        >
          <Route
            route={this.props.route}
            insertWaypoint={this.props.insertWaypoint}
            removeWaypoint={this.props.removeWaypoint}
            updateWaypoint={this.props.updateWaypoint}
          />
        </Map>
        <RouteError message={this.props.route.error} onClick={this.onClickDismissErrors} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    mode: state.app.analysisMode,
    config: state.config,
    route: state.route,
    map: state.map,
    bounds: state.viewBounds.bounds,
    scene: state.tangram.scene
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ ...mapActionCreators, ...routeActionCreators, updateScene }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
