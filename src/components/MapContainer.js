import React from 'react'
import Map from './Map'
import { connect } from 'react-redux'

class MapContainer extends React.Component {
	render() {
		return (
			<Map config={this.props.config}/> 
		)
	}
}

function mapStateToProps(state) {
  return {
    config: state.config,
  }
}

export default connect(mapStateToProps)(MapContainer)
