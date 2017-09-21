import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import ErrorMessage from './ErrorMessage'
import AnalysisName from './AnalysisName'
import ModeSelect from './ModeSelect'
import DatePicker from './DatePicker'
import TimeFilters from './TimeFilters'
import Legend from './Legend'
import ExportData from './ExportData'
import './Sidebar.css'

class Sidebar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      hourValue: 9
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
        <div>
          <img className="app-logo" src="./logo.png" alt="OpenTraffic Analyst" />
          <a href="http://opentraffic.io/"><Icon circular color="grey" name="info" className="info-icon" /></a>
        </div>
        {errors}
        <AnalysisName />
        <ModeSelect />
        {this.props.analysisMode &&
          <DatePicker />
        }
        {this.props.date && this.props.date.startDate &&
          <TimeFilters />
        }
        {this.props.date && this.props.date.startDate &&
          <Legend />
        }
        {this.props.date && this.props.date.startDate &&
          <ExportData />
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    errors: state.errors.errors,
    date: state.date,
    analysisMode: state.app.analysisMode
  }
}

export default connect(mapStateToProps)(Sidebar)
