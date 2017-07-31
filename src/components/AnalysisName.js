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

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleSubmit (event) {
    let input = this.refs.viewName.inputRef.value
    if (input === '') {
      input = 'Untitled Analysis'
    }
    this.setState({ isEditing: false })
    document.title = input + ' | OpenTraffic Analyst UI'
    this.props.dispatch(app.setAnalysisName(input))
  }

  handleClick (event) {
    this.setState({ isEditing: true })
  }

  handleCancel (event) {
    this.setState({ isEditing: false })
  }

  render () {
    if (this.state.isEditing) {
      return (
        <div className="editText">
          <form onSubmit={this.handleSubmit}>
            <Input type="text" action ref="viewName">
              <input defaultValue={this.props.viewName} placeholder="Untitled" />
              <Button color="blue" content="Save" />
              <Button content="Cancel" onClick={this.handleCancel} />
            </Input>
          </form>
        </div>
      )
    } else {
      return (
        <div className="analysisName">
          {this.props.viewName}
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
