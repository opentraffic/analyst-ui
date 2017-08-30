import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates'
import { Segment } from 'semantic-ui-react'
import moment from 'moment'
import { setDate } from '../../../store/actions/date'
import 'react-dates/lib/css/_datepicker.css'
import './DatePicker.css'

class DatePicker extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      focusedInput: null
    }
  }

  handleDateChange = (date) => {
    // if start/end is not equal to null then take unix of timestamp of start/end
    const start = date.startDate instanceof (moment) ? date.startDate.valueOf() : null
    const end = date.endDate instanceof (moment) ? date.endDate.valueOf() : null

    this.props.dispatch(setDate(start, end))
  }

  render () {
    // changing unix timestamp back into moment to initialize props of DateRangePicker
    function changeUnixToMoment (timestamp) {
      return (timestamp === null) ? null : moment(timestamp)
    }

    const start = this.props.startDate
    const end = this.props.endDate
    const today = moment()

    // If info panel needed, return in renderCalendarInfo
    const infoPanel = (
      <div className="info-panel">
        This is an info panel
      </div>
    )

    return (
      <Segment>
        <DateRangePicker
          startDate={changeUnixToMoment(start)}  // momentPropTypes.momentObj or null,
          endDate={changeUnixToMoment(end)} // momentPropTypes.momentObj or null,
          numberOfMonths={1}
          isOutsideRange={day => !isInclusivelyBeforeDay(day, today)}
          onDatesChange={this.handleDateChange}
          showClearDates
          reopenPickerOnClearDates
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          renderCalendarInfo={() => { return infoPanel }}
        />
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    startDate: state.date.startDate,
    endDate: state.date.endDate
  }
}

export default connect(mapStateToProps)(DatePicker)
