import React from 'react'
import { Segment, Header, Button } from 'semantic-ui-react'

export default class ExportData extends React.PureComponent {
  render () {
    return (
      <Segment>
        <Header as="h3">Export</Header>
        <Button icon="download" content="Download" color="blue" fluid />
      </Segment>
    )
  }
}
