import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Input } from 'semantic-ui-react'
import * as app from '../store/actions/app'

class AnalysisName extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      isEditing: false
    }

    const defaultTitle = 'OpenTraffic Analyst UI'
    if (this.props.viewName !== '') {
      document.title = this.props.viewName + ' | ' + defaultTitle
    } else {
      document.title = defaultTitle
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentDidUpdate() {
    if (this.refs.viewName) {
      this.refs.viewName.inputRef.focus()
      this.refs.viewName.inputRef.select()
    }
  }

  handleSubmit (event) {
    const input = this.refs.viewName.inputRef.value
    const defaultTitle = 'OpenTraffic Analyst UI'
    if (input !== '') {
      document.title = input + ' | ' + defaultTitle
    } else {
      document.title = defaultTitle
    }
    this.setState({ isEditing: false })
    this.props.dispatch(app.setAnalysisName(input))
  }

  handleClick (event) {
    this.setState({ isEditing: true })
  }

  handleCancel (event) {
    this.setState({ isEditing: false })
  }

  render () {
    const inputValue = (this.props.viewName === '') ? 'Untitled Analysis' : this.props.viewName
    if (this.state.isEditing) {
      return (
        <div className="editText">
          <form onSubmit={this.handleSubmit}>
            <Input type="text" action ref="viewName">
              <input defaultValue={inputValue} placeholder="Untitled" />
              <Button color="blue" content="Save" />
              <Button content="Cancel" onClick={this.handleCancel} />
            </Input>
          </form>
        </div>
      )
    } else {
      return (
        <div className="analysis-name">
          {inputValue}
          <Button onClick={this.handleClick} content="Edit" icon="edit" labelPosition="right" size="mini" color="blue" floated="right" compact />
        </div>
      )
    }
  }
}

function mapStateToProps (state) {
  return {
    viewName: state.app.viewName
  }
}
export default connect(mapStateToProps)(AnalysisName)
