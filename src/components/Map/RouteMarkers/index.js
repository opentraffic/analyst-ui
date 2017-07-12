import React from 'react'
import PropTypes from 'prop-types'
import { CircleMarker, LayerGroup } from 'react-leaflet'

// Other utility functions
function createMarkers (waypoints, onClick) {
  const START_FILL_COLOR = '#0d0'
  const MIDDLE_FILL_COLOR = '#00d'
  const END_FILL_COLOR = '#d00'
  const MARKER_RADIUS = 5
  const STROKE_WEIGHT = 2

  if (waypoints.length === 0) return null

  return waypoints.map((latlng, index, array) => {
    let fill = MIDDLE_FILL_COLOR
    if (index === 0) {
      fill = START_FILL_COLOR
    } else if (index === array.length - 1) {
      fill = END_FILL_COLOR
    }

    return (
      <CircleMarker
        center={latlng}
        key={latlng}
        radius={MARKER_RADIUS}
        weight={STROKE_WEIGHT}
        color="white"
        opacity="1.0"
        fillColor={fill}
        fillOpacity="1.0"
        bubblingMouseEvents={false}
        onClick={e => {
          onClick(latlng)
        }}
      />
    )
  })
}

export default class RouteMarkers extends React.Component {
  static propTypes = {
    waypoints: PropTypes.array,
    onClick: PropTypes.func
  }

  static defaultProps = {
    waypoints: [],
    onClick: function () {}
  }

  render () {
    const children = createMarkers(this.props.waypoints, this.props.onClick)

    return (
      <LayerGroup>
        {children}
      </LayerGroup>
    )
  }
}
