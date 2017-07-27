import React from 'react'
import PropTypes from 'prop-types'
import { Polyline } from 'react-leaflet'

export default class RouteLine extends React.PureComponent {
  static propTypes = {
    positions: PropTypes.array,
    insertWaypoint: PropTypes.func
  }

  static defaultProps = {
    positions: [],
    insertWaypoint: function () {}
  }

  render () {
    if (!this.props.positions || this.props.positions.length === 0) return null

    return (
      <Polyline
        positions={this.props.positions}
        color="red"
        onMouseDown={this.props.insertWaypoint}
      />
    )
  }
}
