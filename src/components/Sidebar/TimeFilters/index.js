import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Segment, Header, Button } from 'semantic-ui-react'
import dc from 'dc'
import crossfilter from 'crossfilter'
import { createChart } from './chart'
import { toggleTimeFilters, setDayFilter, setHourFilter } from '../../../store/actions/date'
import { isEqual } from 'lodash'

import './TimeFilters.css'

const DAILY_X_SHIFT = -0.5
const HOURLY_X_SHIFT = 0.5

export class TimeFilters extends React.Component {
  static propTypes = {
    filtersEnabled: PropTypes.bool,
    dayFilter: PropTypes.arrayOf(PropTypes.number),
    hourFilter: PropTypes.arrayOf(PropTypes.number),
    speedsBinnedByHour: PropTypes.array
  }

  componentDidMount () {
    const chartData = crossfilter(this.props.speedsBinnedByHour)

    this.makeDailyChart(chartData)
    this.makeHourlyChart(chartData)

    // Turn on filter brushes, if initial props include them!
    if (this.props.filtersEnabled) {
      this.activateFilterExtents()

      // All of this is necessary because after setting a brush programatically,
      // it doesn't re-render them. We have to manually re-call the brush
      // to render. See: https://groups.google.com/forum/#!topic/d3-js/vNaR-vJ9hMg
      // There's more repetitive code here than I like, but we'll have to
      // figure out how to refactor this later.
      dc.renderAll()
      if (this.props.dayFilter) {
        this.dailyChart.select('.brush').call(this.dailyChart.brush().extent(this.props.dayFilter.map(i => i + DAILY_X_SHIFT)))
      }
      if (this.props.hourFilter) {
        this.hourlyChart.select('.brush').call(this.hourlyChart.brush().extent(this.props.hourFilter.map(i => i + HOURLY_X_SHIFT)))
      }
    }

    dc.renderAll()
  }

  componentDidUpdate (prevProps) {
    if (!isEqual(prevProps.speedsBinnedByHour, this.props.speedsBinnedByHour)) {
      const chartData = crossfilter(this.props.speedsBinnedByHour)
      this.makeDailyChart(chartData)
      this.makeHourlyChart(chartData)
      if (this.props.filtersEnabled) {
        this.activateFilterExtents()

        // All of this is necessary because after setting a brush programatically,
        // it doesn't re-render them. We have to manually re-call the brush
        // to render. See: https://groups.google.com/forum/#!topic/d3-js/vNaR-vJ9hMg
        // There's more repetitive code here than I like, but we'll have to
        // figure out how to refactor this later.
        dc.renderAll()
        if (this.props.dayFilter) {
          this.dailyChart.select('.brush').call(this.dailyChart.brush().extent(this.props.dayFilter.map(i => i + DAILY_X_SHIFT)))
        }
        if (this.props.hourFilter) {
          this.hourlyChart.select('.brush').call(this.hourlyChart.brush().extent(this.props.hourFilter.map(i => i + HOURLY_X_SHIFT)))
        }
      } else {
        dc.renderAll()
      }
    }
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

  // Restore filter state if there are saved extents
  // Put the shift amount back in
  activateFilterExtents = () => {
    this.dailyChart.brushOn(true)
    this.hourlyChart.brushOn(true)

    if (this.props.dayFilter) {
      this.dailyChart.brush().extent(this.props.dayFilter.map(i => i + DAILY_X_SHIFT))
    }
    if (this.props.hourFilter) {
      this.hourlyChart.brush().extent(this.props.hourFilter.map(i => i + HOURLY_X_SHIFT))
    }
  }

  // Reset the filter state
  deactivateFilterExtents = () => {
    this.dailyChart.brushOn(false)
    this.hourlyChart.brushOn(false)

    this.hourlyChart.filterAll()
    this.dailyChart.filterAll()
  }

  toggleFilters = (event) => {
    // Toggle and set state
    const brushState = !this.props.filtersEnabled
    this.props.dispatch(toggleTimeFilters())

    // Update charts
    if (brushState === true) {
      this.activateFilterExtents()
    } else {
      this.deactivateFilterExtents()
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
    hourFilter: state.date.hourFilter,
    speedsBinnedByHour: state.barchart.speedsBinnedByHour
  }
}

export default connect(mapStateToProps)(TimeFilters)
