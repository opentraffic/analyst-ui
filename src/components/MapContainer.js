import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import Map from './Map'
import MapSearchBar from './MapSearchBar'
import Loader from './Loader'
import Route from './Map/Route'
import RouteError from './Map/RouteError'
import * as mapActionCreators from '../store/actions/map'
import {
  setRouteError,
  clearRouteError,
  addWaypoint,
  insertWaypoint,
  removeWaypoint,
  updateWaypoint
} from '../store/actions/route'
import { updateScene } from '../store/actions/tangram'
import { drawBounds } from '../app/region-bounds'
import { showRegion, clearRegion } from '../app/region'
import { showRoute } from '../app/route'

const ROUTE_ZOOM_LEVEL = 10

class MapContainer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    apiKey: PropTypes.string.isRequired,
    route: PropTypes.object.isRequired,
    days: PropTypes.array,
    hours: PropTypes.array,
    map: PropTypes.object,
    bounds: PropTypes.shape({
      east: PropTypes.string,
      west: PropTypes.string,
      north: PropTypes.string,
      south: PropTypes.string
    })
  }

  componentDidMount () {
    if (this.props.bounds) {
      drawBounds(this.props.bounds)
      showRegion(this.props.bounds)
    } else {
      showRoute(this.props.route.waypoints)
    }
  }

  componentDidUpdate (prevProps) {
    if (isEqual(prevProps.year, this.props.year) &&
        isEqual(prevProps.week, this.props.week) &&
        isEqual(prevProps.days, this.props.days) &&
        isEqual(prevProps.hours, this.props.hours) &&
        isEqual(prevProps.route.waypoints, this.props.route.waypoints) &&
        isEqual(prevProps.bounds, this.props.bounds)) return

    if (this.props.bounds === null) {
      clearRegion()
      showRoute(this.props.route.waypoints)
    } else {
      showRegion(this.props.bounds)
    }
  }

  onClick = (event) => {
    // Only add waypoint when the original map canvas is clicked. This prevents
    // a bug where clicking a polyline and then adding a marker causes another
    // onClick to fire in the wrong place.
    if (event.originalEvent.target.tagName === 'CANVAS') {
      if (this.props.mode !== 'ROUTE') return
      if (this.props.map.zoom < ROUTE_ZOOM_LEVEL) {
        const message = 'Please zoom to at least zoom 10 before placing a route marker'
        this.props.setRouteError(message)
        return
      }
      this.props.addWaypoint(event.latlng)
    }
  }

  onClickDismissErrors = () => {
    this.props.clearRouteError()
  }

  render () {
    const map = this.props.map

    return (
      <div className={this.props.className}>
        <MapSearchBar
          apiKey={this.props.apiKey}
          setLocation={this.props.setLocation}
          clearLabel={this.props.clearLabel}
          recenterMap={this.props.recenterMap}
          map={this.props.map}
        />
        <Loader />
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
    apiKey: state.config.mapzen.apiKey,
    route: state.route,
    days: state.date.dayFilter,
    hours: state.date.hourFilter,
    year: state.date.year,
    week: state.date.week,
    map: state.map,
    bounds: state.viewBounds.bounds,
    scene: state.tangram.scene
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ ...mapActionCreators, setRouteError, clearRouteError, addWaypoint, insertWaypoint, removeWaypoint, updateWaypoint, updateScene }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
