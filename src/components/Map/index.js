import React from 'react'
import PropTypes from 'prop-types'
import { Map as Leaflet, ScaleControl } from 'react-leaflet'
import 'leaflet-editable'
import 'leaflet.path.drag'
import TangramLayer from './TangramLayer'
import 'leaflet/dist/leaflet.css'
import './Map.css'

const ATTRIBUTION = '<a href="https://mapzen.com/">Mapzen</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, <a href="https://whosonfirst.mapzen.com#License">Who’s on First</a>'

export default class Map extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    center: PropTypes.array,
    zoom: PropTypes.number,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    recenterMap: PropTypes.func
  }

  static defaultProps = {
    center: [0, 0],
    zoom: 3,
    onChange: function () {},
    onClick: function () {}
  }

  componentDidMount () {
    // Expose map globally for debug
    window.map = this.map.leafletElement
  }

  // When map is dragged/zoomed and lat/lng/zoom are changed, update URL to reflect change
  // Config is now also updated whenever lat/lng/zoom are changed
  onChange = (event) => {
    const newCenter = event.target.getCenter()
    const newZoom = event.target.getZoom()

    this.props.recenterMap([newCenter.lat, newCenter.lng], newZoom)
  }

  render () {
    const { className, children, center, zoom, onClick, scene } = this.props

    // The `editable` option is not provided by Leaflet but by Leaflet.Editable.
    // It is passed to the options object via props.
    return (
      <Leaflet
        className={className}
        center={center}
        zoom={zoom}
        onClick={onClick}
        onMoveEnd={this.onChange}
        ref={(ref) => { this.map = ref }}
        editable
      >
        <TangramLayer scene={scene} attribution={ATTRIBUTION} />
        <ScaleControl />
        {children}
      </Leaflet>
    )
  }
}
