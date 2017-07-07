import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Map from './Map'
import { setWaypoint } from '../store/reducers/route'

class MapContainer extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    config: PropTypes.object
  }

  constructor (props) {
    super(props)

    this.onClick = this.onClick.bind(this)
  }

  onClick (event) {
    this.props.dispatch(setWaypoint(event.latlng))
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
        />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    config: state.config
  }
}

export default connect(mapStateToProps)(MapContainer)
