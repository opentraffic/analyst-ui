import React from 'react'
import { Segment, Header, Button } from 'semantic-ui-react'
import dc from 'dc'
import crossfilter from 'crossfilter'
import { createChart } from './chart'

import 'dc/dc.css'
import './BarChart.css'

import data from './testdata.json'

export default class BarChart extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      chartFilters: false,
      filterExtents: {
        hourly: null,
        daily: null
      }
    }
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
      xDomain: [-0.5, 6.5],
      gap: 10,
      onExtentChange: (extent) => {
        this.setState({
          filterExtents: {
            ...this.state.filterExtents,
            daily: extent
          }
        })
      }
    })

    // Customize axes
    this.dailyChart.xAxis().tickFormat(d => dayLabel[d])
    this.dailyChart.yAxis().ticks(5)
  }

  makeHourlyChart = (chartData) => {
    this.hourlyChart = createChart(this.hourlyChartEl, {
      data: chartData,
      // Magnitude dimension is `dayOfWeek` property, subtract 1 to force 0-index
      dimension: (d) => d.hourOfDay,
      xDomain: [0.5, 24.5],
      gap: 5,
      onExtentChange: (extent) => {
        this.setState({
          filterExtents: {
            ...this.state.filterExtents,
            hourly: extent
          }
        })
      }
    })

    // Customize axes
    this.hourlyChart.xAxis().tickFormat()
  }

  toggleFilters = (event) => {
    // Toggle and set state
    const brushState = !this.state.chartFilters
    this.setState({ chartFilters: brushState })

    // Update charts
    this.dailyChart.brushOn(brushState)
    this.hourlyChart.brushOn(brushState)

    // Restore filter state if there are saved extents
    if (brushState === true) {
      if (this.state.filterExtents.daily) {
        this.dailyChart.brush().extent(this.state.filterExtents.daily)
      }
      if (this.state.filterExtents.hourly) {
        this.hourlyChart.brush().extent(this.state.filterExtents.hourly)
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
        <div className="barchart-daily">
          <Header>Speed by day of week</Header>
          <div ref={(ref) => { this.dailyChartEl = ref }} />
        </div>

        <div className="barchart-hourly">
          <Header>Speed by hour of day</Header>
          <div ref={(ref) => { this.hourlyChartEl = ref }} />
        </div>

        <div className="barchart-controls">
          <Button onClick={this.toggleFilters} fluid>enable chart filters</Button>
        </div>
      </Segment>
    )
  }
}
