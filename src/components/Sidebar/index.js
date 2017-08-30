import React from 'react'
import { connect } from 'react-redux'
import ErrorMessage from './ErrorMessage'
import AnalysisName from './AnalysisName'
import ModeSelect from './ModeSelect'
import DatePicker from './DatePicker'
import BarChart from './BarChart'
import Legend from './Legend'
import ExportData from './ExportData'
import './Sidebar.css'

class Sidebar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      hourValue: 23
    }
  }

  render () {
    let errors = null
    if (this.props.errors.length > 0) {
      errors = this.props.errors.map(error => (
        <ErrorMessage header="Routing error" message={error.error} />
      ))
    }

    return (
      <div className={'Sidebar ' + this.props.className}>
        {errors}
        <AnalysisName />
        <ModeSelect />
        <DatePicker />
        <BarChart />
        <Legend />
        <ExportData />
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
