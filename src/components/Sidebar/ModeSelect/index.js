import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header, Button } from 'semantic-ui-react'
import { onClickDrawRectangle } from '../../../lib/region-bounds'
import * as app from '../../../store/reducers/app'

class ModeSelect extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.onClickRegion = this.onClickRegion.bind(this)
    this.onClickRoute = this.onClickRoute.bind(this)
  }

  onClickRegion (event) {
    onClickDrawRectangle()
    this.props.dispatch(app.setRegionAnalysisMode())
  }

  onClickRoute (event) {
    this.props.dispatch(app.setRouteAnalysisMode())
  }

  render () {
    return (
      <Segment>
        <Header as="h3">Select mode</Header>
        <Button.Group fluid>
          <Button icon="crop" content="Analyze region" color="yellow"
            onClick={this.onClickRegion}
          />
          <Button icon="crop" content="Analyze route" color="teal"
            onClick={this.onClickRoute}
          />
        </Button.Group>
      </Segment>
    )
  }
}

export default connect()(ModeSelect)
