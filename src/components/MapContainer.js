import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Map from './Map'
import MapSearchBar from './MapSearchBar'
import * as actionCreators from '../store/actions'

class MapContainer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    config: PropTypes.object,
    mapLocation: PropTypes.object
  }

  render () {
    const config = this.props.config
    const mapLocation = this.props.mapLocation

    return (
      <div className={this.props.className}>
        <MapSearchBar config={config} setLocation={this.props.setLocation} recenterMap={this.props.recenterMap} />
        <Map config={config} center={mapLocation.coordinates} zoom={config.zoom} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    config: state.config,
    mapLocation: state.mapLocation
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
