import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Map from './Map'
import RouteMarkers from './Map/RouteMarkers'
import RouteLine from './Map/RouteLine'
import { setWaypoint, removeWaypoint, setRoute } from '../store/reducers/route'
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

    if (waypoints.length <= 1) return

    getRoute(host, waypoints)
      .then(response => {
        const coordinates = valhallaResponseToPolylineCoordinates(response)
        this.props.dispatch(setRoute(coordinates))
      })
      .catch(error => {
        console.log(error)
      })
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
