import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import { speedRamp, percDiffRamp } from '../../../lib/color-ramps'
import './Legend.css'

export default class Legend extends React.PureComponent {
  makeTableRows () {
    // Make a clone and do not mutate the original array
    const ramp = (this.props.compareEnabled) ? percDiffRamp : speedRamp
    const scale = ramp.slice().reverse()
    return scale.map((i) => {
      return (
        <tr className="legend-row" key={i.color}>
          <th className="legend-color" style={{ backgroundColor: i.color }} />
          <td className="legend-label">{i.label}</td>
        </tr>
      )
    })
  }

  render () {
    return (
      <Segment>
        <Header as="h3">
          { (this.props.compareEnabled) ? 'Percent change, compared to reference speeds' : 'Speed, in kilometers per hour' }
        </Header>
        <table>
          <tbody>
            { this.makeTableRows() }
          </tbody>
        </table>
      </Segment>
    )
  }
}
