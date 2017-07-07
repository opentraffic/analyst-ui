import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Map from './Map'
import RouteMarkers from './Map/RouteMarkers'
import { setWaypoint, removeWaypoint } from '../store/reducers/route'

class MapContainer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    config: PropTypes.object,
    route: PropTypes.object,
  }

  constructor (props) {
    super(props)

    this.onClick = this.onClick.bind(this)
    this.onClickWaypoint = this.onClickWaypoint.bind(this)
  }

  onClick (event) {
    this.props.dispatch(setWaypoint(event.latlng))
  }

  /**
   * This handler function is passed to the RouteMarkers component, which eats
   * the original event argument and passes the latlng value of the marker instead.
   */
  onClickWaypoint (latlng) {
    this.props.dispatch(removeWaypoint(latlng))
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
          <RouteMarkers waypoints={this.props.route.waypoints} onClick={this.onClickWaypoint} />
        </Map>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    config: state.config,
    route: state.route,
  }
}

export default connect(mapStateToProps)(MapContainer)
