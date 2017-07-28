/* global L */
import React from 'react'
import PropTypes from 'prop-types'
import { Marker, Popup, LayerGroup } from 'react-leaflet'
import { Button } from 'semantic-ui-react'
import 'leaflet-extra-markers'
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css'
import './RouteMarkers.css'

export default class RouteMarkers extends React.PureComponent {
  static propTypes = {
    waypoints: PropTypes.array,
    removeWaypoint: PropTypes.func,
    updateWaypoint: PropTypes.func
  }

  static defaultProps = {
    waypoints: [],
    removeWaypoint: function () {},
    updateWaypoint: function () {}
  }

  constructor (props) {
    super(props)

    this.createMarkers = this.createMarkers.bind(this)
  }

  createMarkers () {
    const START_FILL_COLOR = 'green-light'
    const MIDDLE_FILL_COLOR = 'cyan'
    const END_FILL_COLOR = 'orange-dark'
    const { waypoints, removeWaypoint, updateWaypoint } = this.props

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

      const icon = L.ExtraMarkers.icon({
        icon: 'circle',
        prefix: 'map-marker ' + className + ' icon ',
        markerColor: fill
      })

      const onClickButton = (event) => {
        removeWaypoint(latlng)
      }

      const onDragEndMarker = (event) => {
        const oldLatLng = latlng
        const newLatLng = event.target._latlng
        updateWaypoint(oldLatLng, newLatLng)
      }

      return (
        <Marker
          position={latlng}
          key={latlng}
          draggable
          icon={icon}
          onDragEnd={onDragEndMarker}
        >
          <Popup>
            <Button icon="trash" content="Remove waypoint" color="red" onClick={onClickButton} />
          </Popup>
        </Marker>
      )
    })
  }

  render () {
    return (
      <LayerGroup>
        {this.createMarkers()}
      </LayerGroup>
    )
  }
}
