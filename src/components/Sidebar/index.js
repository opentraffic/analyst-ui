import React from 'react'
import { Segment, Header, Accordion, Checkbox } from 'semantic-ui-react'
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
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <p>
        <Checkbox toggle label="Toggle" />
      </p>
      <Accordion panels={panels} styled />
    </Segment>
  </div>
)

export default Sidebar
