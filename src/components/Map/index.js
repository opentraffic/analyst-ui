/* global Tangram */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Map as Leaflet } from 'react-leaflet'
// import Tangram from 'tangram'
import 'leaflet/dist/leaflet.css'
import './Map.css'

const ATTRIBUTION = '<a href="https://mapzen.com/">Mapzen</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, <a href="https://whosonfirst.mapzen.com#License">Who’s on First</a>'

export default class Map extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    config: PropTypes.object,
    onChange: PropTypes.func,
    onClick: PropTypes.func
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

  render () {
    const { className, children, config, onChange, onClick } = this.props
    const { center, zoom } = config.map

    return (
      <Leaflet
        className={className}
        center={center}
        zoom={zoom}
        onLeafletClick={onClick}
        onLeafletZoomEnd={(e) => onChange({ zoom: e.target._zoom })}
        ref={(ref) => { this.map = ref }}
      >
        {children}
      </Leaflet>
    )
  }
}
