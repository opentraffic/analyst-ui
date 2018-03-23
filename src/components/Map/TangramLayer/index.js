/* global Tangram */
// import Tangram from 'tangram' /* does not work because we have not ejected from create-react-app */
import PropTypes from 'prop-types'
import { GridLayer } from 'react-leaflet'
// import { isEqual } from 'lodash'
import { storeReferenceToTangramLayer } from '../../../lib/tangram'
// Extends react-leaflet's GridLayer and wraps Tangram so it works as a
// React component in react-leaflet

export default class TangramLayer extends GridLayer {
  static propTypes = {
    scene: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    refSpeedComparisonEnabled: PropTypes.bool,
    refSpeedEnabled: PropTypes.bool,
    attribution: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.tangram = null
  }

  // A note on updating Tangram through React lifecycle components:
  //
  // Don't do it.
  //
  // React must check whether to update this every time application state changes.
  // Since comparing potentially large scene files are expensive, and so is
  // continuously asking Tangram to load new scenes, there is a lot of overhead
  // for behavior that is going to unnecessary 99% of the time. So, the React
  // "way" of doing things is preserved here in comments, and hopefully we will
  // solve this problem in the future. For now, we only load the scene through
  // props on the initial render.
  //
  // In the meantime, we will need to continue to interact with Tangram
  // imperatively: only load new scene data if and when we know we want to,
  // etc.

  // shouldComponentUpdate (nextProps) {
  //   return isEqual(nextProps.scene, this.props.scene)
  // }
  //
  // componentDidUpdate () {
  //   this.tangram.scene.load(this.props.scene)
  // }

  /**
   * Disable future updating of this component via React. See note above.
   */
  shouldComponentUpdate () {
    return false
  }

  // We are using componentWillRecieveProps here checking the props
  // affecting Tangram configuration is changed (if so, update Tangram config)
  // This is the way we came up with to change the config of Tangram
  // insdie of the related component (TangramLayer), but outside of React lifecycle
  componentWillReceiveProps (nextProps) {
    if (this.props.refSpeedComparisonEnabled !== nextProps.refSpeedComparisonEnabled) {
      this.tangram.scene.config.global.refSpeedComparisonEnabled = nextProps.refSpeedComparisonEnabled
      this.tangram.scene.updateConfig()
    }
    if (this.props.refSpeedEnabled !== nextProps.refSpeedEnabled) {
      this.tangram.scene.config.global.refSpeedEnabled = nextProps.refSpeedEnabled
      this.tangram.scene.updateConfig()
    }
  }

  createLeafletElement (props) {
    this.tangram = Tangram.leafletLayer(this.getOptions(props))
    // Expose to another module for access.
    storeReferenceToTangramLayer(this.tangram)

    return this.tangram
  }

  render () {
    return null
  }
}
