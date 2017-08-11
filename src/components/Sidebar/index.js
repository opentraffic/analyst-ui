import React from 'react'
import { connect } from 'react-redux'
import { Segment, Header, Accordion, Checkbox, Button, Message } from 'semantic-ui-react'
import DatePickerContainer from '../DatePickerContainer'
import ErrorMessage from './ErrorMessage'
import ModeSelect from './ModeSelect'
import AnalysisName from '../AnalysisName'
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
        <Header as="h3">Analysis name</Header>
        <AnalysisName />
      </Segment>
      <ModeSelect />
      <Segment>
        <DatePickerContainer className="date-picker" />
      </Segment>
      <Segment>
        <Header as="h3">Speed, in miles per hour</Header>
        <table>
          <tbody>
            <tr><th style={{ backgroundColor: '#313695', width: '25px', height: '25px' }} /><td style={{ paddingLeft: '0.5em' }}>70 or more</td></tr>
            <tr><th style={{ backgroundColor: '#4575b4', width: '25px', height: '25px' }} /><td style={{ paddingLeft: '0.5em' }}>65</td></tr>
            <tr><th style={{ backgroundColor: '#74add1', width: '25px', height: '25px' }} /><td style={{ paddingLeft: '0.5em' }}>60</td></tr>
            <tr><th style={{ backgroundColor: '#abd9e9', width: '25px', height: '25px' }} /><td style={{ paddingLeft: '0.5em' }}>55</td></tr>
            <tr><th style={{ backgroundColor: '#e0f3f8', width: '25px', height: '25px' }} /><td style={{ paddingLeft: '0.5em' }}>50</td></tr>
            <tr><th style={{ backgroundColor: '#fee090', width: '25px', height: '25px' }} /><td style={{ paddingLeft: '0.5em' }}>45</td></tr>
            <tr><th style={{ backgroundColor: '#fdae61', width: '25px', height: '25px' }} /><td style={{ paddingLeft: '0.5em' }}>40</td></tr>
            <tr><th style={{ backgroundColor: '#f46d43', width: '25px', height: '25px' }} /><td style={{ paddingLeft: '0.5em' }}>35</td></tr>
            <tr><th style={{ backgroundColor: '#d73027', width: '25px', height: '25px' }} /><td style={{ paddingLeft: '0.5em' }}>30</td></tr>
            <tr><th style={{ backgroundColor: '#a50026', width: '25px', height: '25px' }} /><td style={{ paddingLeft: '0.5em' }}>25 or less</td></tr>
          </tbody>
        </table>
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
