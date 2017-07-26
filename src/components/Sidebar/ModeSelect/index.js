import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header, Button } from 'semantic-ui-react'
import { startDrawingBounds } from '../../../lib/region-bounds'
import * as app from '../../../store/reducers/app'
import { setBounds } from '../../../store/reducers/viewBounds'

class ModeSelect extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.onClickRegion = this.onClickRegion.bind(this)
    this.onClickRoute = this.onClickRoute.bind(this)
    this.onClickClearAnalysis = this.onClickClearAnalysis.bind(this)
    this.handleBounds = this.handleBounds.bind(this)
  }

  /**
   * @param {L.LatLngBounds}
   */
  handleBounds (latLngBounds) {
    const north = latLngBounds.getNorth()
    const south = latLngBounds.getSouth()
    const east = latLngBounds.getEast()
    const west = latLngBounds.getWest()

    this.props.dispatch(setBounds({ north, south, east, west }))
  }

  onClickRegion (event) {
    startDrawingBounds(this.handleBounds)
    this.props.dispatch(app.setRegionAnalysisMode())
  }

  onClickRoute (event) {
    this.props.dispatch(app.setRouteAnalysisMode())
  }

  onClickClearAnalysis (event) {
    this.props.dispatch(app.clearAnalysisMode())
  }

  render () {
    return (
      <Segment>
        <Header as="h3">Select mode</Header>
        <Button.Group fluid>
          <Button icon="crop" content="Analyze region" color="yellow"
            onClick={this.onClickRegion}
          />
          <Button icon="car" content="Analyze route" color="teal"
            onClick={this.onClickRoute}
          />
        </Button.Group>
        <Button icon="remove" content="Clear analysis area" color="grey"
          onClick={this.onClickClearAnalysis} fluid basic style={{ marginTop: '0.5em' }}
        />
      </Segment>
    )
  }
}

export default connect()(ModeSelect)
