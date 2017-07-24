import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import L from 'leaflet'
import Map from './Map'
import MapSearchBar from './MapSearchBar'
import RouteMarkers from './Map/RouteMarkers'
import RouteLine from './Map/RouteLine'
import RouteError from './Map/RouteError'
import { getRoute, valhallaResponseToPolylineCoordinates } from '../lib/valhalla'
import { getNewWaypointPosition } from '../lib/routing'
import * as actionCreators from '../store/actions'
import * as routeActionCreators from '../store/reducers/route'
import { updateURL, getQueryStringObject, parseQueryString } from '../url-state'

class MapContainer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    config: PropTypes.object,
    route: PropTypes.object,
    mapLocation: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.initMap()

    this.initMap = this.initMap.bind(this)
    this.initRoute = this.initRoute.bind(this)
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

  initMap (queryString = window.location.search) {
    const { config } = this.props
    // If bare url
    if (queryString.length === 0) {
      const initial = {
        lat: config.map.center[0],
        lng: config.map.center[1],
        zoom: config.map.zoom
      }
      updateURL(initial)
    } else { // If query string exists (copy/paste url)
      // Get necessary params
      const object = getQueryStringObject(queryString)
      const center = [Number(object.lat), Number(object.lng)]
      const zoom = Number(object.zoom)
      const label = object.label || ''

      // Update redux store to display given params
      this.props.recenterMap(center, zoom)
      this.props.setLocation(center, label)
      this.initRoute(object)
    }
  }

  initRoute (queryObject) {
    if (parseQueryString('waypoints') !== null) {
      // Split the string into array of latlng points
      const waypoints = queryObject.waypoints.split(',')
      for (var i = 0; i < waypoints.length; i++) {
        // Get the lat and lng for each waypoint
        const latlng = waypoints[i].split('/')
        // Initialize to leaflet latLng
        const point = L.latLng(
          Number(latlng[0]),
          Number(latlng[1])
        )
        // Add waypoint to route
        this.props.addWaypoint(point)
      }
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
    const mapLocation = this.props.mapLocation

    return (
      <div className={this.props.className}>
        <MapSearchBar config={config} setLocation={this.props.setLocation} recenterMap={this.props.recenterMap} />
        <Map
          config={config}
          center={mapLocation.coordinates}
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
    mapLocation: state.mapLocation
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ ...actionCreators, ...routeActionCreators }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
