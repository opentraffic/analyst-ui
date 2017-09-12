import React from 'react'
import PropTypes from 'prop-types'
import { Polyline, LayerGroup } from 'react-leaflet'
import { getSpeedColor } from '../../../../lib/color-ramps'
import { getSegmentWidth } from '../../../../lib/route-segments'

export default class RouteMultiLine extends React.PureComponent {
  static propTypes = {
    segments: PropTypes.arrayOf(PropTypes.shape({
      coordinates: PropTypes.array,
      color: PropTypes.string
    })),
    insertWaypoint: PropTypes.func
  }

  static defaultProps = {
    segments: [],
    insertWaypoint: function () {}
  }

  createPolylineBorder () {
    return this.props.segments.map((segment, index) => {
      return (
        <Polyline
          positions={segment.coordinates}
          color="#222"
          weight={getSegmentWidth(this.props.zoom) + 3}
          key={index}
        />
      )
    })
  }

  createPolylineSegment () {
    return this.props.segments.map((segment, index) => {
      return (
        <Polyline
          positions={segment.coordinates}
          color={getSpeedColor(segment.speed)}
          weight={getSegmentWidth(this.props.zoom)}
          onMouseDown={this.props.insertWaypoint}
          key={index}
        />
      )
    })
  }

  render () {
    if (!this.props.segments || this.props.segments.length === 0) return null
    return (
      <LayerGroup>
        {this.createPolylineBorder()}
        {this.createPolylineSegment()}
      </LayerGroup>
    )
  }
}
