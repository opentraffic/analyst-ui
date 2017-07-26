import React from 'react'
import { Segment, Header, Button } from 'semantic-ui-react'
import { onClickDrawRectangle } from '../../../lib/region-bounds'

export default class ModeSelect extends React.PureComponent {
  constructor (props) {
    super(props)

    this.onClickRegion = this.onClickRegion.bind(this)
    this.onClickRoute = this.onClickRoute.bind(this)
  }

  onClickRegion (event) {
    onClickDrawRectangle()
  }

  onClickRoute (event) {
    onClickRoute()
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
