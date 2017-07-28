/* global Tangram */
import React from 'react'
import PropTypes from 'prop-types'
import { Map as Leaflet, ScaleControl } from 'react-leaflet'
import 'leaflet-editable'
import 'leaflet.path.drag'
// import Tangram from 'tangram'
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
    onClick: PropTypes.func,
    recenterMap: PropTypes.func
  }

  static defaultProps = {
    center: [0, 0],
    zoom: 3,
    onChange: function () {},
    onClick: function () {}
  }

  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)
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

    // Expose map globally for debug
    window.map = this.map.leafletElement
  }

  // When map is dragged/zoomed and lat/lng/zoom are changed, update URL to reflect change
  // Config is now also updated whenenver lat/lng/zoom are changed
  onChange (event) {
    const newCenter = event.target.getCenter()
    const newZoom = event.target.getZoom()

    this.props.recenterMap([newCenter.lat, newCenter.lng], newZoom)
  }

  render () {
    const { className, children, center, zoom, onClick } = this.props

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
        <ScaleControl />
        {children}
      </Leaflet>
    )
  }
}
