import React from 'react'
import PropTypes from 'prop-types'
import { LayerGroup, Polyline } from 'react-leaflet'

export default class RouteLine extends React.Component {
  static propTypes = {
    positions: PropTypes.array
  }

  static defaultProps = {
    positions: []
  }

  render () {
    if (!this.props.positions || this.props.positions.length === 0) return null
    return (
      <LayerGroup>
        <Polyline positions={this.props.positions} color="red" />
      </LayerGroup>
    )
  }
}
