import React from 'react'
import { Segment, Header } from 'semantic-ui-react'

export default class Legend extends React.PureComponent {
  render () {
    return (
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
    )
  }
}
