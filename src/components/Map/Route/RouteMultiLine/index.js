import React from 'react'
import PropTypes from 'prop-types'
import { Polyline, LayerGroup } from 'react-leaflet'
import { getSpeedColor } from '../../../../lib/color-ramps'

function getSegmentWidth(zoom) {
  const widths = [[17, 4], [18, 18], [20, 48]]
  if (zoom < 13) { return 5 }
  for (let i = 0; i < widths.length; i++) {
    const zoomValue = widths[i][0]
    const width = widths[i][1]
    if (zoom === zoomValue) {
      return width
    } else if (zoom < widths[0][0]) {
      return widths[0][1]
    } else if (zoom > widths[widths.length-1][0]) {
      return widths[widths.length-1][1]
    } else if (zoom < zoomValue) {
      const y = widths[i - 1][1]
      const x = widths[i - 1][0]
      const slope = (width - y) / (zoomValue - x)
      const b = y - (x * slope)
      const newValue = slope * zoom + b
      return newValue
    }
  }
}

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
