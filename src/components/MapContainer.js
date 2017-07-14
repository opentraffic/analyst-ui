import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import Map from './Map'
import MapSearchBar from './MapSearchBar'
import RouteMarkers from './Map/RouteMarkers'
import RouteLine from './Map/RouteLine'
import RouteError from './Map/RouteError'
import { getRoute, valhallaResponseToPolylineCoordinates } from '../lib/valhalla'
import * as actionCreators from '../store/actions'
import * as routeActionCreators from '../store/reducers/route'

class MapContainer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    config: PropTypes.object,
    route: PropTypes.object,
    mapLocation: PropTypes.object
  }

  constructor (props) {
    super(props)

    this.onClick = this.onClick.bind(this)
    this.handleRemoveWaypoint = this.handleRemoveWaypoint.bind(this)
    this.onDragEndWaypoint = this.onDragEndWaypoint.bind(this)
    this.onClickDismissErrors = this.onClickDismissErrors.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (isEqual(prevProps.route.waypoints, this.props.route.waypoints)) return

    this.showRoute()
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
          zoom={config.zoom}
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
