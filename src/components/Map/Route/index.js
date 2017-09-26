import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { LayerGroup } from 'react-leaflet'
import RouteMarkers from './RouteMarkers'
import RouteLine from './RouteLine'
import { getNewWaypointPosition } from '../../../lib/routing'

class Route extends React.PureComponent {
  static propTypes = {
    positions: PropTypes.object,
    insertWaypoint: PropTypes.func.isRequired,
    removeWaypoint: PropTypes.func.isRequired,
    updateWaypoint: PropTypes.func.isRequired
  }

  /**
   * Handler function to insert a waypoint.
   * This is passed to the RouteLine component, which calls this with the
   * original event argument.
   */
  insertWaypoint = (event) => {
    const { waypoints, lineCoordinates } = this.props.route
    const index = getNewWaypointPosition(event.latlng, waypoints, lineCoordinates)
    this.props.insertWaypoint(event.latlng, index)
  }

  /**
   * Handler function to remove a waypoint.
   * This is passed to the RouteMarkers component, which absorbs the original
   * event argument and passes the latlng position of the marker instead.
   */
  removeWaypoint = (latlng) => {
    this.props.removeWaypoint(latlng)
  }

  /**
   * Handler function to update a waypoint after its marker is dragged.
   * This is passed to the RouteMarkers component, which absorbs the original
   * event argument and passes the old and new latlng positions of the marker.
   */
  updateWaypoint = (oldLatLng, newLatLng) => {
    this.props.updateWaypoint(oldLatLng, newLatLng)
  }

  render () {
    return (
      <LayerGroup>
        <RouteLine
          segments={this.props.route.multiSegments}
          zoom={this.props.zoom}
          insertWaypoint={this.insertWaypoint}
        />
        <RouteMarkers
          waypoints={this.props.route.waypoints}
          removeWaypoint={this.removeWaypoint}
          updateWaypoint={this.updateWaypoint}
        />
      </LayerGroup>
    )
  }
}

function mapStateToProps (state) {
  return {
    zoom: state.map.zoom
  }
}

export default connect(mapStateToProps)(Route)
