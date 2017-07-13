import React from 'react'
import PropTypes from 'prop-types'
import { Marker, LayerGroup } from 'react-leaflet'

// Other utility functions
function createMarkers (waypoints, onClick) {
  // const START_FILL_COLOR = '#0d0'
  // const MIDDLE_FILL_COLOR = '#00d'
  // const END_FILL_COLOR = '#d00'

  if (waypoints.length === 0) return null

  return waypoints.map((latlng, index, array) => {
    // let fill = MIDDLE_FILL_COLOR
    // if (index === 0) {
    //   fill = START_FILL_COLOR
    // } else if (index === array.length - 1) {
    //   fill = END_FILL_COLOR
    // }

    return (
      <Marker
        position={latlng}
        key={latlng}
        draggable
        onClick={event => {
          onClick(latlng)
        }}
        onDragEnd={event => {
          const oldLatLng = latlng
          const newLatLng = event.target._latlng
          console.log(oldLatLng, newLatLng)
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
