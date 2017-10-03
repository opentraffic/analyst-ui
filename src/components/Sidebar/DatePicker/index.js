import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates'
import { Segment, Header } from 'semantic-ui-react'
import moment from 'moment'
import { setDate } from '../../../store/actions/date'
import 'react-dates/lib/css/_datepicker.css'
import './DatePicker.css'

class DatePicker extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    startDate: PropTypes.number,
    endDate: PropTypes.number
  }

  constructor (props) {
    super(props)
    this.state = {
      focusedInput: null
    }
  }

  handleDateChange = (date) => {
    let start,
      end
    // if start/end is not equal to null then take unix of timestamp of start/end
    if (date.startDate instanceof (moment)) {
      // also here is where we enforce the selection of one week (7 days)
      start = date.startDate.startOf('isoWeek').valueOf()
      end = date.startDate.endOf('isoWeek').valueOf()
      // now that we have both a start and and end, let's close the date picker
      this.setState({ focusedInput: false })
    } else {
      start = null
      end = null
    }

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

    return (
      <Segment>
        <Header as="h3">Analysis week</Header>
        <DateRangePicker
          startDate={changeUnixToMoment(start)}  // momentPropTypes.momentObj or null,
          endDate={changeUnixToMoment(end)} // momentPropTypes.momentObj or null,
          numberOfMonths={1}
          firstDayOfWeek={1}
          isOutsideRange={day => !isInclusivelyBeforeDay(day, today)}
          onDatesChange={this.handleDateChange}
          showClearDates
          reopenPickerOnClearDates
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          hideKeyboardShortcutsPanel
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
