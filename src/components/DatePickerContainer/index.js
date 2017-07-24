import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates'
import moment from 'moment'
import store from '../../store'
import { updateURL } from '../../url-state'
import 'react-dates/lib/css/_datepicker.css'
import './DatePickerContainer.css'

class DatePickerContainer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      focusedInput: null
    }

    this.handleDateChange = this.handleDateChange.bind(this)
  }

  handleDateChange (date) {
    // if start/end is not equal to null then take unix of timestamp of start/end
    const start = date.startDate instanceof (moment) ? date.startDate.valueOf() : null
    const end = date.endDate instanceof (moment) ? date.endDate.valueOf() : null

    this.props.dispatch({
      type: 'SET_DATE',
      startDate: start,
      endDate: end
    })

    const dateParam = {
      startDate: start,
      endDate: end
    }
    updateURL(dateParam)
  }

  render () {
    // changing unix timestamp back into moment to initialize props of DateRangePicker
    function changeUnixToMoment (timestamp) {
      return (timestamp === null) ? null : moment(timestamp)
    }

    const start = store.getState().date.startDate
    const end = store.getState().date.endDate
    const today = moment()

    // If info panel needed, return in renderCalendarInfo
    const infoPanel = (
      <div className="info-panel">
        This is an info panel
      </div>
    )

    return (
      <div className="date-picker">
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
      </div>
    )
  }
}

export default connect()(DatePickerContainer)
