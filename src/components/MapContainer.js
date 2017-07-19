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
    this.onClick = this.onClick.bind(this)
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
    // If there is a start and end waypoint, update url
    if (numOfPoints > 1) {
      const points = {
        st_lat: waypoints[0].lat,
        st_lng: waypoints[0].lng,
        end_lat: waypoints[numOfPoints - 1].lat,
        end_lng: waypoints[numOfPoints - 1].lng
      }
      updateURL(points)

      // If there is a mid waypoint, initialize mid_lat and mid_lng
      // If there is no mid waypoint, initialize to null to remove param from url query string
      const mid_latlng = {
        mid_lat: (numOfPoints > 2) ? waypoints[Math.floor(numOfPoints/2)].lat : null,
        mid_lng: (numOfPoints > 2) ? waypoints[Math.floor(numOfPoints/2)].lng : null
      }
      updateURL(mid_latlng)
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

      if (parseQueryString('st_lat') !== null) {
        // Getting start lat/lng and end lat/lng
        // Have to turn them into Leaflet's latlng object first
        const st_latlng = L.latLng (
          Number(object.st_lat),
          Number(object.st_lng)
        )
        const end_latlng = L.latLng (
          Number(object.end_lat),
          Number(object.end_lng)
        )

        this.props.addWaypoint(st_latlng)

        if (parseQueryString('mid_lat') !== null) {
          const mid_latlng = L.latLng (
            Number(object.mid_lat),
            Number(object.mid_lng)
          )
          this.props.addWaypoint(mid_latlng)
        }

        this.props.addWaypoint(end_latlng)
      }

      // Update redux store to display given params
      this.props.recenterMap(center, zoom)
      this.props.setLocation(center, label)
    }
  }

  onClick (event) {
    this.props.addWaypoint(event.latlng)
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
        >
          <RouteLine positions={this.props.route.lineCoordinates} />
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
