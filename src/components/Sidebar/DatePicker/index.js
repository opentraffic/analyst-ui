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

    // also here is where we enforce the selection of one week (7 days)
    if (date.startDate instanceof (moment)) {
      start = date.startDate.startOf("week").valueOf()
      end = date.startDate.endOf("week").valueOf()
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

    // If info panel needed, return in renderCalendarInfo
    const infoPanel = (
      <div className="info-panel">
        This is an info panel
      </div>
    )

    return (
      <Segment>
        <Header as="h3">Analysis week</Header>
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
