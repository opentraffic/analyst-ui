/* global Tangram */
import React from 'react'
import PropTypes from 'prop-types'
import { Map as Leaflet, ScaleControl } from 'react-leaflet'
// import Tangram from 'tangram'
import { updateURL } from '../../url-state'
import 'leaflet/dist/leaflet.css'
import './Map.css'

const ATTRIBUTION = '<a href="https://mapzen.com/">Mapzen</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, <a href="https://whosonfirst.mapzen.com#License">Who’s on First</a>'

export default class Map extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    config: PropTypes.object.isRequired,
    center: PropTypes.array,
    zoom: PropTypes.number,
    onChange: PropTypes.func,
    onClick: PropTypes.func
  }

  static defaultProps = {
    center: [0, 0],
    zoom: 3,
    onChange: function () {},
    onClick: function () {}
  }

  componentDidMount () {
    const layer = Tangram.leafletLayer({
      scene: {
        import: [
          'https://mapzen.com/carto/refill-style/7/refill-style.zip',
          // 'https://mapzen.com/carto/refill-style/7/themes/gray.zip'
          'https://mapzen.com/carto/refill-style/7/themes/gray-gold.zip'
        ],
        global: {
          'sdk_mapzen_api_key': this.props.config.mapzen.apiKey
        }
      },
      attribution: ATTRIBUTION
    })

    layer.addTo(this.map.leafletElement)
  }

  // When map is dragged and lat/lng are changed, update URL to reflect change
  // Not sure if config needs to be updated as well
  handleDrag (event) {
    const newCenter = event.target.getCenter()
    const centerParams = {
      lat: newCenter.lat.toFixed(4),
      lng: newCenter.lng.toFixed(4)
    }
    updateURL(centerParams)
  }

  // When map is zoomed in/out, update URL to represent change
  // Not sure if config needs to be update as well
  handleZoom (event) {
    const newZoom = event.target.getZoom()
    const zoomParams = {
      zoom: newZoom.toFixed(4)
    }
    updateURL(zoomParams)
  }

  render () {
    const { className, children, center, zoom, onClick } = this.props

    return (
      <Leaflet
        className={className}
        center={center}
        zoom={zoom}
        onClick={onClick}
        onZoomEnd={this.handleZoom}
        onMoveEnd={this.handleDrag}
        ref={(ref) => { this.map = ref }}
      >
        <ScaleControl />
        {children}
      </Leaflet>
    )
  }
}
