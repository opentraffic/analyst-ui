import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Segment, Radio, Divider } from 'semantic-ui-react'
import dc from 'dc'
import crossfilter from 'crossfilter2'
import { createChart } from './chart'
import { setRefSpeedComparisonEnabled, setRefSpeedEnabled } from '../../../store/actions/app'
import { setDayFilter, setHourFilter } from '../../../store/actions/date'
import { isEqual } from 'lodash'

import './TimeFilters.css'

const DAILY_X_SHIFT = -0.5
const HOURLY_X_SHIFT = 0.5

export class TimeFilters extends React.Component {
  static propTypes = {
    dayFilter: PropTypes.arrayOf(PropTypes.number),
    hourFilter: PropTypes.arrayOf(PropTypes.number),
    speedsBinnedByHour: PropTypes.array,
    refSpeedsBinnedByHour: PropTypes.array,
    percentDiffsBinnedByHour: PropTypes.array,
    refSpeedComparisonEnabled: PropTypes.bool,
    refSpeedEnabled: PropTypes.bool
  }

  componentDidUpdate (prevProps) {
    const { refSpeedComparisonEnabled, refSpeedEnabled, percentDiffsBinnedByHour, speedsBinnedByHour, refSpeedsBinnedByHour } = this.props
    const chartData = (refSpeedComparisonEnabled) ? crossfilter(percentDiffsBinnedByHour) : (refSpeedEnabled) ? crossfilter(refSpeedsBinnedByHour) : crossfilter(speedsBinnedByHour)

    this.makeDailyChart(chartData)
    this.makeHourlyChart(chartData)

    // All of this is necessary because after setting a brush programatically,
    // it doesn't re-render them. We have to manually re-call the brush
    // to render. See: https://groups.google.com/forum/#!topic/d3-js/vNaR-vJ9hMg
    // There's more repetitive code here than I like, but we'll have to
    // figure out how to refactor this later.
    dc.renderAll()
    if (this.props.dayFilter) {
      this.dailyChart.brush().extent(this.props.dayFilter.map(i => i + DAILY_X_SHIFT)) // update brush
      this.dailyDimension.filter(this.props.dayFilter.map(i => i + DAILY_X_SHIFT)) // apply filter
    }
    if (this.props.hourFilter) {
      this.hourlyChart.brush().extent(this.props.hourFilter.map(i => i + HOURLY_X_SHIFT)) // update brush
      this.hourlyDimension.filter(this.props.hourFilter.map(i => i + HOURLY_X_SHIFT)) // apply filter
    }

    dc.renderAll()
  }

  shouldComponentUpdate (nextProps) {
    return (
      !isEqual(nextProps.speedsBinnedByHour, this.props.speedsBinnedByHour) ||
      !isEqual(nextProps.refSpeedsBinnedByHour, this.props.refSpeedsBinnedByHour) ||
      !isEqual(nextProps.percentDiffsBinnedByHour, this.props.percentDiffsBinnedByHour) ||
      !isEqual(nextProps.refSpeedComparisonEnabled, this.props.refSpeedComparisonEnabled) ||
      !isEqual(nextProps.refSpeedEnabled, this.props.refSpeedEnabled)
    )
  }

  makeDailyChart = (chartData) => {
    const dayLabel = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]

    let chartResponse = createChart(this.dailyChartEl, {
      data: chartData,
      // Magnitude dimension is `dayOfWeek` property, subtract 1 to force 0-index
      dimension: (d) => (d.dayOfWeek - 1),
      xDomain: [0, 7],
      xShift: DAILY_X_SHIFT,
      gap: 10,
      onExtentChange: (extent) => {
        this.props.dispatch(setDayFilter(extent))
      }
    })

    this.dailyChart = chartResponse.chart
    this.dailyDimension = chartResponse.dimension

    // Customize axes
    this.dailyChart.xAxis().tickFormat(d => dayLabel[d])
    this.dailyChart.yAxis().ticks(5)
  }

  makeHourlyChart = (chartData) => {
    let chartResponse = createChart(this.hourlyChartEl, {
      data: chartData,
      dimension: (d) => d.hourOfDay,
      xDomain: [0, 24],
      xShift: HOURLY_X_SHIFT,
      gap: 5,
      onExtentChange: (extent) => {
        this.props.dispatch(setHourFilter(extent))
      }
    })
    this.hourlyChart = chartResponse.chart
    this.hourlyDimension = chartResponse.dimension

    // Customize axes
    this.hourlyChart.xAxis().tickFormat()
  }

  render () {
    return (
      <Segment>
        <div className="timefilter-daily">
          <strong>
            { (this.props.refSpeedComparisonEnabled) ? 'Percent change in speed by day-of-week' : (this.props.refSpeedEnabled) ? 'Reference speed (KPH) by day-of-week' : 'Average speed (KPH) by day-of-week' }
          </strong>
          <div ref={(ref) => { this.dailyChartEl = ref }} />
        </div>

        <div className="timefilter-hourly">
          <strong>
            { (this.props.refSpeedComparisonEnabled) ? 'Percent change in speed by hour-of-day' : (this.props.refSpeedEnabled) ? 'Reference speed (KPH) by hour-of-day' : 'Average speed (KPH) by hour-of-day' }
          </strong>
          <div ref={(ref) => { this.hourlyChartEl = ref }} />
        </div>
        <Divider />
        <div className="radio">
          <strong>
            <Radio
              toggle
              label="Compare against reference speeds"
              checked={this.props.refSpeedComparisonEnabled}
              onChange={(event, data) => {
                this.props.dispatch(setRefSpeedComparisonEnabled(data.checked))
              }}
            />
          </strong>
        </div>
        <Divider />
        <div className="radio">
          <strong>
            <Radio
              toggle
              label="Show reference speeds"
              checked={this.props.refSpeedEnabled}
              onChange={(event, data) => {
                this.props.dispatch(setRefSpeedEnabled(data.checked))
              }}
            />
          </strong>
        </div>
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    dayFilter: state.date.dayFilter,
    hourFilter: state.date.hourFilter,
    speedsBinnedByHour: state.barchart.speedsBinnedByHour,
    refSpeedsBinnedByHour: state.barchart.refSpeedsBinnedByHour,
    percentDiffsBinnedByHour: state.barchart.percentDiffsBinnedByHour,
    refSpeedComparisonEnabled: state.app.refSpeedComparisonEnabled,
    refSpeedEnabled: state.app.refSpeedEnabled
  }
}

export default connect(mapStateToProps)(TimeFilters)
