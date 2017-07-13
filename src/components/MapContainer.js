import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Map from './Map'
import RouteMarkers from './Map/RouteMarkers'
import RouteLine from './Map/RouteLine'
import RouteError from './Map/RouteError'
import {
  setWaypoint,
  removeWaypoint,
  setRoute,
  setRouteError,
  clearRoute,
  clearRouteError
} from '../store/reducers/route'
import { getRoute, valhallaResponseToPolylineCoordinates } from '../lib/valhalla'

class MapContainer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    className: PropTypes.string,
    config: PropTypes.object,
    route: PropTypes.object
  }

  constructor (props) {
    super(props)

    this.onClick = this.onClick.bind(this)
    this.onClickWaypoint = this.onClickWaypoint.bind(this)
    this.onClickDismissErrors = this.onClickDismissErrors.bind(this)
  }

  onClick (event) {
    this.props.dispatch(setWaypoint(event.latlng))
    this.showRoute()
  }

  /**
   * This handler function is passed to the RouteMarkers component, which eats
   * the original event argument and passes the latlng value of the marker instead.
   */
  onClickWaypoint (latlng) {
    this.props.dispatch(removeWaypoint(latlng))
    this.showRoute()
  }

  showRoute () {
    const host = 'routing-prod.opentraffic.io'
    const waypoints = this.props.route.waypoints

    if (waypoints.length <= 1) {
      // TODO: probably not the best place to do this
      this.props.dispatch(clearRoute())
      this.props.dispatch(clearRouteError())
      return
    }

    getRoute(host, waypoints)
      .then(response => {
        const coordinates = valhallaResponseToPolylineCoordinates(response)
        this.props.dispatch(setRoute(coordinates))
      })
      .catch(error => {
        let message
        if (typeof error === 'object' && error.error) {
          message = error.error
        } else {
          message = error
        }
        this.props.dispatch(setRouteError(message))
      })
  }

  onClickDismissErrors () {
    this.props.dispatch(clearRouteError())
  }

  render () {
    const config = this.props.config

    return (
      <div className={this.props.className}>
        <Map
          config={config}
          center={config.center}
          zoom={config.zoom}
          onClick={this.onClick}
        >
          <RouteLine positions={this.props.route.lineCoordinates} />
          <RouteMarkers waypoints={this.props.route.waypoints} onClick={this.onClickWaypoint} />
        </Map>
        <RouteError message={this.props.route.error} onClick={this.onClickDismissErrors} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    config: state.config,
    route: state.route
  }
}

export default connect(mapStateToProps)(MapContainer)
