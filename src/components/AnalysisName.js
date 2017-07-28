import React from 'react'
import { Label, Header, Input, Button } from 'semantic-ui-react'

class AnalysisName extends React.Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (event) {
    console.log(this.refs.analysis.inputRef.value)
  }
  render() {
    const saveButton = <Button content="Save" onClick={this.handleClick} />

    return (
      <div>
        <Header as="h3"> Name your analysis </Header>
        <Input fluid action={saveButton} placeholder="Untitled analysis" ref="analysis" />
      </div>
    )
  }
}

export default AnalysisName
