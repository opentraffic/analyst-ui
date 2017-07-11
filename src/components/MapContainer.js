import React from 'react'
import PropTypes from 'prop-types'
import Map from './Map'
import { connect } from 'react-redux'

class MapContainer extends React.Component {
  static PropTypes = {
    className: PropTypes.string,
    config: PropTypes.object
  }

  render() {
    const config = this.props.config

    return (
      <div className={this.props.className}>
        <Map config={config} center={config.center} zoom={config.zoom} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    config: state.config,
  }
}

export default connect(mapStateToProps)(MapContainer)