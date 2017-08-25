import React from 'react'
import { Segment, Header, Button } from 'semantic-ui-react'
import dc from 'dc'
import * as d3 from 'd3'
import crossfilter from 'crossfilter'
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

    this.dailyChart = dc.barChart(this.dailyChartEl)

    // Magnitude dimension is `dayOfWeek` property, subtract 1 to force 0-index
    const dayCount = chartData.dimension(d => (d.dayOfWeek - 1))
    const dayCountGroup = dayCount.group().reduce(
      // Callback for when data is added to the current filter results
      function (p, v) {
        p.count += v.c
        p.sum += v.s
        if (p.count > 0) {
          p.avg = (p.sum / p.count)
        } else {
          p.avg = 0
        }
        return p
      },
      // Callback for when data is removed from the current filter results
      function (p, v) {
        p.count -= v.c
        p.sum -= v.s
        if (p.count > 0) {
          p.avg = (p.sum / p.count)
        } else {
          p.avg = 0
        }
        return p
      },
      // Initialize `p`
      function () {
        return {
          count: 0,
          sum: 0,
          avg: 0
        }
      }
    )

    this.dailyChart
      .width(430)
      .height(150)
      .margins({top: 5, right: 10, bottom: 20, left: 40})
      .dimension(dayCount)
      .group(dayCountGroup)
      .transitionDuration(0)
      // X-axis placement and formatting
      .valueAccessor(p => p.value.avg)
      .x(d3.scale.linear().domain([-0.5, 6.5]))
      .centerBar(true)
      .gap(10)
      // Y-axis
      .renderHorizontalGridLines(true)
      .elasticY(true)
      // Filter brush
      .brushOn(false)
      .round(n => Math.floor(n) + 0.5)
      .alwaysUseRounding(true)

    // Customize axes
    this.dailyChart.xAxis().tickFormat(d => dayLabel[d])
    this.dailyChart.yAxis().ticks(5)

    // Set up handler for brush filtering
    this.dailyChart.brush().on('brushend.custom', () => {
      const extent = this.dailyChart.brush().extent()
      this.setState({
        filterExtents: {
          ...this.state.filterExtents,
          daily: extent
        }
      })
    })
  }

  makeHourlyChart = (chartData) => {
    this.hourlyChart = dc.barChart(this.hourlyChartEl)

    const hourCount = chartData.dimension(d => d.hourOfDay)
    const hourCountGroup = hourCount.group().reduce(
      // Callback for when data is added to the current filter results
      function (p, v) {
        p.count += v.c
        p.sum += v.s
        if (p.count > 0) {
          p.avg = (p.sum / p.count)
        } else {
          p.avg = 0
        }
        return p
      },
      // Callback for when data is removed from the current filter results
      function (p, v) {
        p.count -= v.c
        p.sum -= v.s
        if (p.count > 0) {
          p.avg = (p.sum / p.count)
        } else {
          p.avg = 0
        }
        return p
      },
      // Initialize `p`
      function () {
        return {
          count: 0,
          sum: 0,
          avg: 0
        }
      }
    )

    this.hourlyChart
      .width(430)
      .height(150)
      .margins({top: 5, right: 10, bottom: 20, left: 40})
      .dimension(hourCount)
      .group(hourCountGroup)
      .transitionDuration(0)
      // X-axis placement and formatting
      .valueAccessor(p => p.value.avg)
      .x(d3.scale.linear().domain([0.5, 24.5]))
      .centerBar(true)
      .gap(5)
      // Y-axis
      .renderHorizontalGridLines(true)
      .elasticY(true)
      // Filter brush
      .brushOn(false)
      .round(n => Math.floor(n) + 0.5)
      .alwaysUseRounding(true)

    // Customize axes
    this.hourlyChart.xAxis().tickFormat()

    // Set up handler for brush filtering
    this.hourlyChart.brush().on('brushend.custom', () => {
      const extent = this.hourlyChart.brush().extent()
      this.setState({
        filterExtents: {
          ...this.state.filterExtents,
          hourly: extent
        }
      })
    })
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
