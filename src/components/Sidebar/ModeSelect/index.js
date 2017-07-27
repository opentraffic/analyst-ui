import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header, Button } from 'semantic-ui-react'
import { startDrawingBounds } from '../../../app/region-bounds'
import * as app from '../../../store/actions/app'
import { resetAnalysis } from '../../../store/actions/reset'

class ModeSelect extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    activeMode: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.onClickRegion = this.onClickRegion.bind(this)
    this.onClickRoute = this.onClickRoute.bind(this)
    this.onClickClearAnalysis = this.onClickClearAnalysis.bind(this)
  }

  onClickRegion (event) {
    this.props.dispatch(resetAnalysis())
    this.props.dispatch(app.setRegionAnalysisMode())
    startDrawingBounds()
  }

  onClickRoute (event) {
    this.props.dispatch(resetAnalysis())
    this.props.dispatch(app.setRouteAnalysisMode())
  }

  onClickClearAnalysis (event) {
    this.props.dispatch(resetAnalysis())
  }

  render () {
    return (
      <Segment>
        <Header as="h3">Analysis mode</Header>
        <Button.Group fluid>
          <Button
            icon="crop"
            content="Region"
            color="blue"
            onClick={this.onClickRegion}
            basic={!(this.props.activeMode === 'REGION')}
          />
          <Button
            icon="car"
            content="Route"
            color="blue"
            onClick={this.onClickRoute}
            basic={!(this.props.activeMode === 'ROUTE')}
          />
        </Button.Group>
        <Button
          icon="remove"
          content="Clear analysis"
          color="grey"
          onClick={this.onClickClearAnalysis}
          fluid
          basic
          style={{ marginTop: '0.5em' }}
        />
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    activeMode: state.app.analysisMode
  }
}

export default connect(mapStateToProps)(ModeSelect)
