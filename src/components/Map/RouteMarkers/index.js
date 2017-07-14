/* global L */
import React from 'react'
import PropTypes from 'prop-types'
import { Marker, Popup, LayerGroup } from 'react-leaflet'
import { Button } from 'semantic-ui-react'
import 'leaflet-extra-markers'
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css'
import './RouteMarkers.css'

// Other utility functions
function createMarkers (waypoints, handleRemove, onDragEnd) {
  const START_FILL_COLOR = 'green-light'
  const MIDDLE_FILL_COLOR = 'cyan'
  const END_FILL_COLOR = 'orange-dark'

  if (waypoints.length === 0) return null

  return waypoints.map((latlng, index, array) => {
    let fill = MIDDLE_FILL_COLOR
    let className = 'map-marker-middle'

    if (index === 0) {
      fill = START_FILL_COLOR
      className = 'map-marker-start'
    } else if (index === array.length - 1) {
      fill = END_FILL_COLOR
      className = 'map-marker-end'
    }

    const redMarker = L.ExtraMarkers.icon({
      icon: 'circle',
      prefix: 'map-marker ' + className + ' icon ',
      markerColor: fill
    })

    const removeHandler = (event) => {
      handleRemove(latlng)
    }

    return (
      <Marker
        position={latlng}
        key={latlng}
        draggable
        icon={redMarker}
        onDragEnd={event => {
          const oldLatLng = latlng
          const newLatLng = event.target._latlng
          onDragEnd(oldLatLng, newLatLng)
        }}
      >
        <Popup>
          <Button icon="trash" content="Remove waypoint" color="red" onClick={removeHandler} />
        </Popup>
      </Marker>
    )
  })
}

export default class RouteMarkers extends React.PureComponent {
  static propTypes = {
    waypoints: PropTypes.array,
    handleRemove: PropTypes.func,
    onDragEnd: PropTypes.func
  }

  static defaultProps = {
    waypoints: [],
    handleRemove: function () {},
    onDragEnd: function () {}
  }

  render () {
    const { waypoints, handleRemove, onDragEnd } = this.props
    const children = createMarkers(waypoints, handleRemove, onDragEnd)

    return (
      <LayerGroup>
        {children}
      </LayerGroup>
    )
  }
}
