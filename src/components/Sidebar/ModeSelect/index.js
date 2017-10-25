import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Confirm, Segment, Header, Button } from 'semantic-ui-react'
import { startDrawingBounds, removeShades } from '../../../app/region-bounds'
import { setDataCoverage } from '../../../app/dataGeojson'
import { setRegionAnalysisMode, setRouteAnalysisMode } from '../../../store/actions/app'
import { resetAnalysis } from '../../../store/actions/reset'
import { clearBarchart } from '../../../store/actions/barchart'
import { setDayFilter, setHourFilter, clearDateRange, clearDate } from '../../../store/actions/date'

export class ModeSelect extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    activeMode: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      open: false,
      case: null,
      available: (this.props.activeMode === null)
    }
  }

  handleDataClick = () => {
    // Check if dataCoverage is global
    if (window.dataCoverage) {
      (this.state.available) ? window.dataCoverage.remove() : window.dataCoverage.addTo(window.map)
    } else if (!this.state.available) {
      setDataCoverage()
    }
    this.setState({
      available: !(this.state.available)
    })
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
    } else {
      this.props.dispatch(clearDate())
    }
    this.setState({case: null})
    this.props.dispatch(clearDateRange())
    this.props.dispatch(clearBarchart())
    this.props.dispatch(setDayFilter([0, 7]))
    this.props.dispatch(setHourFilter([0, 24]))
    removeShades()
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
      if (window.dataCoverage) {
        this.setState({ available: false })
        window.dataCoverage.remove()
      }
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
    } else { // Else if route button is clicked and no region exists, change mode
      this.props.dispatch(setRouteAnalysisMode())
      if (window.dataCoverage) {
        this.setState({available: false})
        window.dataCoverage.remove()
      }
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
    } else { // Else if route/region is not drawn but was clicked, turn off mode
      this.props.dispatch(resetAnalysis())
      this.props.dispatch(clearDateRange())
      this.props.dispatch(clearDate())
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
        <Button
          content={(this.state.available) ? 'Hide Data Availability' : 'Show Data Availability'}
          onClick={this.handleDataClick}
          fluid
          toggle
          active={this.state.available}
          style={{ marginTop: '0.5em' }}
        />
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    activeMode: state.app.analysisMode,
    route: state.route.waypoints,
    region: state.view.bounds
  }
}

export default connect(mapStateToProps)(ModeSelect)
