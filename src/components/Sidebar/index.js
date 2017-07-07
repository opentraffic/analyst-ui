import React from 'react'
import { Segment, Header, Accordion, Checkbox, Button, Message } from 'semantic-ui-react'
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

const Sidebar = (props) => (
  <div className={'Sidebar ' + props.className}>
    <Segment>
      <Header as="h3">Section header</Header>
      <p><strong>Yo! This is a split branch test.</strong></p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <Message>
        <Checkbox toggle label="Toggle" />
      </Message>
      <Accordion panels={panels} styled />
    </Segment>
    <Segment>
      <Header as="h3">Export</Header>
      <Button icon="download" content="Download" color="blue" fluid />
    </Segment>
  </div>
)

export default Sidebar
