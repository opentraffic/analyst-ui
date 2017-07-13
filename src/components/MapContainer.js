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
    config: PropTypes.object
  }

  render () {
    const config = this.props.config

		return (
			<div className={this.props.className}>
				<MapSearchBar config={config} setLocation={this.props.setLocation} recenterMap={this.props.recenterMap} />
				<Map config={config} center={config.center} zoom={config.zoom} />
			</div>
		)
	}
}

function mapStateToProps (state) {
  return {
    config: state.config
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
