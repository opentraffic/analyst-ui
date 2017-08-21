import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import { speedRamp } from '../../../lib/color-ramps'

export default class Legend extends React.PureComponent {
  makeTableRows () {
    const scale = speedRamp.slice().reverse()
    console.log(scale)
    return scale.map((i) => {
      return (
        <tr key={i.color}>
          <th style={{ backgroundColor: i.color, width: '25px', height: '25px' }} />
          <td style={{ paddingLeft: '0.5em' }}>{i.label}</td>
        </tr>
      )
    })
  }

  render () {
    return (
      <Segment>
        <Header as="h3">Speed, in kilometers per hour</Header>
        <table>
          <tbody>
            {this.makeTableRows()}
          </tbody>
        </table>
      </Segment>
    )
  }
}
