import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Segment, Header, Button } from 'semantic-ui-react'
import dc from 'dc'
import crossfilter from 'crossfilter'
import { createChart } from './chart'
import { toggleTimeFilters, setDayFilter, setHourFilter } from '../../../store/actions/date'

import './TimeFilters.css'
import data from './testdata.json'

const DAILY_X_SHIFT = -0.5
const HOURLY_X_SHIFT = 0.5

export class TimeFilters extends React.Component {
  static propTypes = {
    filtersEnabled: PropTypes.bool,
    dayFilter: PropTypes.arrayOf(PropTypes.number),
    hourFilter: PropTypes.arrayOf(PropTypes.number)
  }

  componentDidMount () {
    const chartData = crossfilter(data.hours)

    this.makeDailyChart(chartData)
    this.makeHourlyChart(chartData)

    dc.renderAll()
  }

  makeDailyChart = (chartData) => {
    const dayLabel = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]

    this.dailyChart = createChart(this.dailyChartEl, {
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

    // Customize axes
    this.dailyChart.xAxis().tickFormat(d => dayLabel[d])
    this.dailyChart.yAxis().ticks(5)
  }

  makeHourlyChart = (chartData) => {
    this.hourlyChart = createChart(this.hourlyChartEl, {
      data: chartData,
      dimension: (d) => d.hourOfDay,
      xDomain: [0, 24],
      xShift: HOURLY_X_SHIFT,
      gap: 5,
      onExtentChange: (extent) => {
        this.props.dispatch(setHourFilter(extent))
      }
    })

    // Customize axes
    this.hourlyChart.xAxis().tickFormat()
  }

  toggleFilters = (event) => {
    // Toggle and set state
    const brushState = !this.props.filtersEnabled
    this.props.dispatch(toggleTimeFilters())

    // Update charts
    this.dailyChart.brushOn(brushState)
    this.hourlyChart.brushOn(brushState)

    // Restore filter state if there are saved extents
    // Put the shift amount back in
    if (brushState === true) {
      if (this.props.dayFilter) {
        this.dailyChart.brush().extent(this.props.dayFilter.map(i => i + DAILY_X_SHIFT))
      }
      if (this.props.hourFilter) {
        this.hourlyChart.brush().extent(this.props.hourFilter.map(i => i + HOURLY_X_SHIFT))
      }

      // TODO: This doesn't redraw the charts with new brush extents.
    } else {
      // Reset the filter state
      this.hourlyChart.filterAll()
      this.dailyChart.filterAll()
    }

    dc.renderAll()
  }

  render () {
    return (
      <Segment>
        <div className="timefilter-daily">
          <Header>Speed by day of week</Header>
          <div ref={(ref) => { this.dailyChartEl = ref }} />
        </div>

        <div className="timefilter-hourly">
          <Header>Speed by hour of day</Header>
          <div ref={(ref) => { this.hourlyChartEl = ref }} />
        </div>

        <div className="timefilter-controls">
          {
            (this.props.filtersEnabled)
            ? <Button onClick={this.toggleFilters} fluid color="orange">disable chart filters</Button>
            : <Button onClick={this.toggleFilters} fluid>enable chart filters</Button>
          }
        </div>
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    filtersEnabled: state.date.filtersEnabled,
    dayFilter: state.date.dayFilter,
    hourFilter: state.date.hourFilter
  }
}

export default connect(mapStateToProps)(TimeFilters)
