/* global Tangram */
// import Tangram from 'tangram' /* does not work because we have not ejected from create-react-app */
import PropTypes from 'prop-types'
import { GridLayer } from 'react-leaflet'

// Extends react-leaflet's GridLayer and wraps Tangram so it works as a
// React component in react-leaflet
export default class TangramLayer extends GridLayer {
  static propTypes = {
    scene: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    attribution: PropTypes.string
  }

  createLeafletElement (props) {
    return Tangram.leafletLayer(this.getOptions(props))
  }

  render () {
    return null
  }
}
