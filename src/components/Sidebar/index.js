import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import ErrorMessage from './ErrorMessage'
import AnalysisName from './AnalysisName'
import ModeSelect from './ModeSelect'
import DatePicker from './DatePicker'
import TimeFilters from './TimeFilters'
import ETAView from './ETAView'
import Legend from './Legend'
import ExportData from './ExportData'
import './Sidebar.css'

class Sidebar extends React.Component {
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
          <img className="app-logo" src="./logo.png" alt="Open Traffic Analyst" />
          <a href="https://github.com/opentraffic/analyst-ui/wiki" target="_blank"><Icon circular color="grey" name="info" className="info-icon" title="Learn more about Analyst UI" /></a>
        </div>
        {errors}
        <AnalysisName />
        <ModeSelect />
        {this.props.analysisMode &&
          <DatePicker />
        }
        {this.props.analysisMode && this.props.date && this.props.date.startDate &&
          <TimeFilters />
        }
        <ETAView />
        {this.props.analysisMode && this.props.date && this.props.date.startDate &&
          <Legend compareEnabled={this.props.refSpeedComparisonEnabled} />
        }
        {this.props.analysisMode && this.props.date && this.props.date.startDate &&
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
    analysisMode: state.app.analysisMode,
    refSpeedComparisonEnabled: state.app.refSpeedComparisonEnabled
  }
}

export default connect(mapStateToProps)(Sidebar)
