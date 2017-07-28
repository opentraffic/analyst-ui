import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Confirm, Segment, Header, Button } from 'semantic-ui-react'
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

    this.state = {
      open: false
    }

    this.onClickRegion = this.onClickRegion.bind(this)
    this.onClickRoute = this.onClickRoute.bind(this)
    this.onClickClearAnalysis = this.onClickClearAnalysis.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  handleCancel () {
    this.setState({open: false})
  }

  handleConfirm () {
    this.setState({open: false})
    this.props.dispatch(resetAnalysis())
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
    const routeExists = this.props.route.length > 0
    const regionExists = this.props.region !== null
    // If route is drawn or region is drawn, have user confirm to clear analysis
    if (routeExists || regionExists) {
      this.setState({open: true})
    } else { // Else if route/region is not drawn but was clicked, turn off mode
      this.props.dispatch(resetAnalysis())
    }
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
        <Confirm
          header="Clear analysis"
          content={'Are you sure you want to clear your ' + this.props.activeMode + '?'}
          open={this.state.open}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    activeMode: state.app.analysisMode,
    route: state.route.waypoints,
    region: state.viewBounds.bounds
  }
}

export default connect(mapStateToProps)(ModeSelect)
