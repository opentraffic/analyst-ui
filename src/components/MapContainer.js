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
import * as routeActionCreators from '../store/actions/route'
import { updateScene } from '../store/actions/tangram'
import { drawBounds } from '../app/region-bounds'
import { showRegion } from '../app/region'
import { doRoutestuff } from '../app/route'

const ROUTE_ZOOM_LEVEL = 10

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
  }

  componentDidMount () {
    if (this.props.bounds) {
      drawBounds(this.props.bounds)
      showRegion(this.props.bounds)
    }
  }

  componentDidUpdate (prevProps) {
    if (isEqual(prevProps.route.waypoints, this.props.route.waypoints) &&
        isEqual(prevProps.bounds, this.props.bounds)) return

    this.showRoute()
    showRegion(this.props.bounds)
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

  showRoute () {
    const host = 'routing-prod.opentraffic.io'
    const waypoints = this.props.route.waypoints

    if (waypoints.length <= 1) {
      // TODO: probably not the best place to do this
      this.props.clearRoute()
      this.props.clearRouteError()
      return
    }

    doRoutestuff(host, waypoints)
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
