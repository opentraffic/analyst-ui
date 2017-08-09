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
import { getTileUrlSuffix, parseSegmentId } from '../lib/tiles'
import * as mapActionCreators from '../store/actions/map'
import * as routeActionCreators from '../store/actions/route'
import { updateScene } from '../store/actions/tangram'
import { drawBounds } from '../app/region-bounds'
import { fetchDataTiles } from '../app/data'

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

    // Fetch data tiles from various sources.
    const STATIC_DATA_TILE_PATH = 'https://s3.amazonaws.com/speed-extracts/2017/0/'

    // Fetch route from Valhalla-based routing service, given waypoints.
    getRoute(host, waypoints)
      .then(response => {
        // Transform Valhalla response to polyline coordinates that can be
        // rendered to the map, and send it to map state store.
        const coordinates = valhallaResponseToPolylineCoordinates(response)
        this.props.setRoute(coordinates)

        return coordinates
      })
      // With the coordinates we obtained for the route, we make an additional
      // trace_attributes request to the routing service. We will parse this
      // response further down in this chain.
      .then(coordinates => {
        return getTraceAttributes(host, coordinates)
      })
      // This `catch` statement is placed here to handle errors from Fetch API.
      .catch(error => {
        const message = (typeof error === 'object' && error.error)
          ? error.error
          : error

        this.props.setRouteError(message)
      })
      // If we're here, the network requests have succeeded. We now need to
      // parse the response from `trace_attributes`. Here, we obtain the
      // OSMLR segment ids for each edge.
      .then(response => {
        const segments = []
        const segmentIds = []

        // Documentation for trace_attributes response:
        // https://mapzen.com/documentation/mobility/map-matching/api-reference/#outputs-of-trace_attributes
        // The response contains an `edges` property. Each `edge` may include
        // a `traffic_segments` property that correlates this edge with the OSMLR
        // segment. This property is unique to the routing service deployed for
        // OpenTraffic and is not part of the original Valhalla specification.
        response.edges.forEach(edge => {
          // It is possible for an edge not to have `traffic_segments`. These
          // are likely edges that are not routable or not meaningful in the
          // OpenTraffic system, or they are routes that have not yet been
          // parsed and given an OSMLR id.
          if (!edge.traffic_segments) return

          // For each segment in `traffic_segments`, record all segments in one
          // array, and segment ids in another array.
          edge.traffic_segments.forEach((segment) => {
            segments.push(segment)
            segmentIds.push(segment.segment_id)
          })
        })

        // OSMLR segments and Valhalla edges do not share a 1:1 relationship.
        // It is possible for a sequence of edges to share the same segment ID,
        // so there may be repetition in the array. First, remove all duplicate
        // segment IDs, then parse each one. Each ID is a mask of three numbers
        // that contain the tile level, tile index, and segment index. The
        // result is an array of objects [{ level, tile, segment }, ...].
        // Also, reject any segments at level 2; we won't have any data for those.
        const parsedIds = reject(uniq(segmentIds).map(parseSegmentId), obj =>
          obj.level === 2)

        // We now create data tile filepath suffixes from the parsed IDs, which
        // are used to build URLs for fetching data tiles. By looking at the
        // ids from the route segments, this allows us to fetch only the tiles
        // we need. (If we looked only at the bounding box of the route, we
        // would be downloading more tiles than we need to use.)
        // We also filter out duplicate suffixes to avoid downloading the same
        // tiles more than once.
        const suffixes = uniq(parsedIds.map(getTileUrlSuffix))
        const urls = suffixes.map(suffix => `${STATIC_DATA_TILE_PATH}${suffix}.spd.0.gz`)

        // TODO: We should also cache any tile that's already been retrieved.
        // See the `data.js` module. Cache should be handled transparently there.

        // Download all data tiles
        fetchDataTiles(urls)
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
            console.log('[fetchDataTiles error]', error)
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
