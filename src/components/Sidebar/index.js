import React from 'react'
import { connect } from 'react-redux'
import { Segment, Header, Accordion, Checkbox, Button, Message } from 'semantic-ui-react'
import DatePickerContainer from '../DatePickerContainer'
import ErrorMessage from './ErrorMessage'
import { onClickDrawRectangle } from '../../lib/region-bounds'
import './Sidebar.css'

const panels = [
  {
    title: 'Test1',
    content: 'This is a sentence1'
  },
  {
    title: 'Test2',
    content: 'This is a sentence2'
  },
  {
    title: 'Test3',
    content: 'This is a sentence3'
  }
]

const Sidebar = (props) => {
  let errors = null
  if (props.errors.length > 0) {
    errors = props.errors.map(error => (
      <ErrorMessage header="Routing error" message={error.error} />
    ))
  }

  return (
    <div className={'Sidebar ' + props.className}>
      {errors}
      <Segment>
        <Header as="h3">Select mode</Header>
        <Button.Group fluid>
          <Button icon="crop" content="Analyze region" color="yellow"
            onClick={onClickDrawRectangle}
          />
          <Button icon="crop" content="Analyze route" color="teal"
            onClick={onClickDrawRectangle}
          />
        </Button.Group>
      </Segment>
      <Segment>
        <Header as="h3">Section header</Header>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <Message>
          <Checkbox toggle label="Toggle" />
        </Message>
        <Accordion panels={panels} styled />
      </Segment>
      <Segment>
        <DatePickerContainer className="date-picker" />
      </Segment>
      <Segment>
        <Header as="h3">Export</Header>
        <Button icon="download" content="Download" color="blue" fluid />
      </Segment>
    </div>
  )
}

function mapStateToProps (state) {
  return {
    errors: state.errors.errors
  }
}

export default connect(mapStateToProps)(Sidebar)
