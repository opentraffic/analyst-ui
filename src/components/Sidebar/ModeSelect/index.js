import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Confirm, Segment, Header, Button } from 'semantic-ui-react'
import { startDrawingBounds, removeShades } from '../../../app/region-bounds'
import { setRegionAnalysisMode, setRouteAnalysisMode } from '../../../store/actions/app'
import { resetAnalysis } from '../../../store/actions/reset'

export class ModeSelect extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    activeMode: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      open: false,
      case: null
    }
  }

  handleCancel = () => {
    this.setState({
      open: false,
      case: null
    })
  }

  handleConfirm = () => {
    this.setState({open: false})
    this.props.dispatch(resetAnalysis())
    // Check what button was clicked to handle action
    if (this.state.case === 'region') {
      this.props.dispatch(setRegionAnalysisMode())
      startDrawingBounds()
    } else if (this.state.case === 'route') {
      this.props.dispatch(setRouteAnalysisMode())
    }
    this.setState({case: null})
  }

  onClickRegion = (event) => {
    const routeExists = this.props.route.length > 0
    // If region button is clicked but selected route exists, have user confirm to clear route
    if (this.props.activeMode !== null && routeExists) {
      this.setState({
        open: true,
        case: 'region'
      })
    } else { // Else allow region to be drawn
      this.props.dispatch(setRegionAnalysisMode())
      startDrawingBounds()
    }
  }

  onClickRoute = (event) => {
    const regionExists = this.props.region !== null
    // If route button is clicked but selected region exists, have user confirm to clear region
    if (this.props.activeMode !== null && regionExists) {
      this.setState({
        open: true,
        case: 'route'
      })
      removeShades()
    } else { // Else if route button is clicked and no region exists, change mode
      this.props.dispatch(setRouteAnalysisMode())
    }
  }

  onClickClearAnalysis = (event) => {
    const routeExists = this.props.route.length > 0
    const regionExists = this.props.region !== null
    // If route is drawn or region is drawn, have user confirm to clear analysis
    if (routeExists || regionExists) {
      this.setState({
        open: true,
        case: 'clear analysis'
      })
      removeShades()
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
