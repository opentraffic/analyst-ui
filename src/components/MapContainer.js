import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEqual, reject } from 'lodash'
import Map from './Map'
import MapSearchBar from './MapSearchBar'
import RouteMarkers from './Map/RouteMarkers'
import RouteLine from './Map/RouteLine'
import RouteError from './Map/RouteError'
import { getRoute, getTraceAttributes, valhallaResponseToPolylineCoordinates } from '../lib/valhalla'
import { getNewWaypointPosition } from '../lib/routing'
import { getTilesForBbox, getTileUrlSuffix } from '../lib/tiles'
import * as mapActionCreators from '../store/actions/map'
import * as routeActionCreators from '../store/actions/route'
import { updateURL } from '../lib/url-state'

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
    this.onMouseDownLine = this.onMouseDownLine.bind(this)
    this.handleRemoveWaypoint = this.handleRemoveWaypoint.bind(this)
    this.onDragEndWaypoint = this.onDragEndWaypoint.bind(this)
    this.onClickDismissErrors = this.onClickDismissErrors.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (isEqual(prevProps.route.waypoints, this.props.route.waypoints)) return

    this.showRoute()

    // Updating URL
    const waypoints = this.props.route.waypoints
    const numOfPoints = waypoints.length
    const points = {
      waypoints: []
    }

    if (numOfPoints > 0) {
      for (var i = 0; i < numOfPoints; i++) {
        const lat = waypoints[i].lat.toFixed(4)
        const lng = waypoints[i].lng.toFixed(4)
        const latlng = lat + '/' + lng
        // Push latlng point to array of waypoints
        points.waypoints.push(latlng)
      }
      updateURL(points)
    } else { // If points all removed
      // Remove waypoints from url query string
      points.waypoints = null
      updateURL(points)
    }
  }

  onClick (event) {
    // Only add waypoint when the original map canvas is clicked. This prevents
    // a bug where clicking a polyline and then adding a marker causes another
    // onClick to fire in the wrong place.
    if (event.originalEvent.target.tagName === 'CANVAS') {
      this.props.addWaypoint(event.latlng)
    }
  }

  onMouseDownLine (event) {
    const { waypoints, lineCoordinates } = this.props.route
    const index = getNewWaypointPosition(event.latlng, waypoints, lineCoordinates)
    this.props.insertWaypoint(event.latlng, index)
  }

  /**
   * This handler function is passed to the RouteMarkers component, which eats
   * the original event argument and passes the latlng value of the marker instead.
   */
  handleRemoveWaypoint (latlng) {
    this.props.removeWaypoint(latlng)
  }

  onDragEndWaypoint (oldLatLng, newLatLng) {
    this.props.updateWaypoint(oldLatLng, newLatLng)
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

    getRoute(host, waypoints)
      .then(response => {
        const coordinates = valhallaResponseToPolylineCoordinates(response)
        this.props.setRoute(coordinates)

        // Get bounding box for OSMLR tiles
        const bounds = response.trip.summary
        const tiles = getTilesForBbox(bounds.min_lon, bounds.min_lat, bounds.max_lon, bounds.max_lat)

        // Get tiles (experimental)
        const STATIC_TILE_PATH = 'https://s3.amazonaws.com/speed-extracts/week0_2017/'
        // For now, reject tiles at level 2
        const downloadTiles = reject(tiles, (i) => i[0] === 2)
        const tileUrls = []
        downloadTiles.forEach(i => {
          tileUrls.push(`${STATIC_TILE_PATH}${getTileUrlSuffix(i)}.json`)
        })

        // const promises = tileUrls.map(url => fetch(url).then(res => res.json()))
        // Promise.all(promises).then(results => {
        //   console.log(results)
        // })

        return coordinates
      })
      .then(coordinates => {
        // Experimental.
        return getTraceAttributes(host, coordinates)
      })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        let message
        if (typeof error === 'object' && error.error) {
          message = error.error
        } else {
          message = error
        }
        this.props.setRouteError(message)
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
        <MapSearchBar config={config} setLocation={this.props.setLocation} recenterMap={this.props.recenterMap} />
        <Map
          config={config}
          center={map.coordinates}
          zoom={config.map.zoom}
          onClick={this.onClick}
          recenterMap={this.props.recenterMap}
        >
          <RouteLine positions={this.props.route.lineCoordinates} onMouseDown={this.onMouseDownLine} />
          <RouteMarkers
            waypoints={this.props.route.waypoints}
            handleRemove={this.handleRemoveWaypoint}
            onDragEnd={this.onDragEndWaypoint}
          />
        </Map>
        <RouteError message={this.props.route.error} onClick={this.onClickDismissErrors} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    config: state.config,
    route: state.route,
    map: state.map
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ ...mapActionCreators, ...routeActionCreators }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
