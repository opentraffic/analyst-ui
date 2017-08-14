import React from 'react'
import { connect } from 'react-redux'
import { Segment, Header, Button } from 'semantic-ui-react'
import DatePickerContainer from '../DatePickerContainer'
import ErrorMessage from './ErrorMessage'
import ModeSelect from './ModeSelect'
import Legend from './Legend'
import AnalysisName from '../AnalysisName'
import './Sidebar.css'
import store from '../../store'

class Sidebar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      hourValue: 23
    }

    this.onChangeSelect = this.onChangeSelect.bind(this)
  }

  onChangeSelect (event) {
    const value = event.target.value
    this.setState({ hourValue: value })
    store.dispatch({
      type: 'set_hour',
      value: Number(value)
    })
  }

  render () {
    let errors = null
    if (this.props.errors.length > 0) {
      errors = this.props.errors.map(error => (
        <ErrorMessage header="Routing error" message={error.error} />
      ))
    }

    function generateHours () {
      const arr = [...Array(168).keys()]
      return arr.map(i => {
        return <option value={i} key={i}>{i}</option>
      })
    }

    return (
      <div className={'Sidebar ' + this.props.className}>
        {errors}
        <Segment>
          <Header as="h3">Analysis name</Header>
          <AnalysisName />
        </Segment>
        <ModeSelect />
        <Segment>
          <DatePickerContainer className="date-picker" />
          <Header as="h3">Budget time picker</Header>
          <select value={this.state.value} onChange={this.onChangeSelect}>
            {generateHours()}
          </select>
        </Segment>
        <Legend />
        <Segment>
          <Header as="h3">Export</Header>
          <Button icon="download" content="Download" color="blue" fluid />
        </Segment>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    errors: state.errors.errors
  }
}

export default connect(mapStateToProps)(Sidebar)
