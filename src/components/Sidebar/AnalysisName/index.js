import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header, Button, Input } from 'semantic-ui-react'
import { setAnalysisName } from '../../../store/actions/app'
import './AnalysisName.css'

export class AnalysisName extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    viewName: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      isEditing: false
    }
  }

  componentDidUpdate () {
    if (this.viewName) {
      this.viewName.inputRef.focus()
      this.viewName.inputRef.select()
    }
  }

  onSubmitInput = (event) => {
    event.preventDefault()
    this.onClickSave()
  }

  onClickEdit = (event) => {
    this.setState({ isEditing: true })
  }

  onClickSave = (event) => {
    const input = this.viewName.inputRef.value
    this.setState({ isEditing: false })
    this.props.dispatch(setAnalysisName(input))
  }

  onClickCancel = (event) => {
    this.setState({ isEditing: false })
  }

  render () {
    const placeholder = 'Untitled analysis'
    const inputValue = this.props.viewName || placeholder
    const children = (this.state.isEditing) ? (
      <form className="analysis-edit-form" onSubmit={this.onSubmitInput}>
        <Input type="text" action ref={(ref) => { this.viewName = ref }}>
          <input defaultValue={inputValue} placeholder={placeholder} />
          <Button color="blue" content="Save" onClick={this.onClickSave} />
          <Button content="Cancel" onClick={this.onClickCancel} />
        </Input>
      </form>
    ) : (
      <div>
        <span className="analysis-name">{inputValue}</span>
        <Button
          onClick={this.onClickEdit}
          content="Edit"
          icon="edit"
          labelPosition="right"
          size="mini"
          color="blue"
          floated="right"
          basic
          compact
        />
      </div>
    )

    return (
      <Segment>
        <Header as="h3">Analysis name</Header>
        {children}
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    viewName: state.app.viewName
  }
}

export default connect(mapStateToProps)(AnalysisName)
