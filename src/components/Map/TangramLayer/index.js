/* global Tangram */
// import Tangram from 'tangram' /* does not work because we have not ejected from create-react-app */
import PropTypes from 'prop-types'
import { GridLayer } from 'react-leaflet'
import { isEqual } from 'lodash'

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

  constructor (props) {
    super(props)

    this.tangram = null
  }

  shouldComponentUpdate (nextProps) {
    return isEqual(nextProps.scene, this.props.scene)
  }

  componentDidUpdate () {
    this.tangram.scene.load(this.props.scene)
  }

  createLeafletElement (props) {
    this.tangram = Tangram.leafletLayer(this.getOptions(props))
    return this.tangram
  }

  render () {
    return null
  }
}
