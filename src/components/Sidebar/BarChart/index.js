import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import dc from 'dc'
import * as d3 from 'd3'
import crossfilter from 'crossfilter'
import './BarChart.css'

import data from './testdata.json'

export default class BarChart extends React.Component {
  componentDidMount () {
    this.makeTemporaryDcChart()
  }

  makeTemporaryDcChart = () => {
    const dayLabel = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]
    const dailyChart = dc.barChart(this.dailyChart)
    const ndx = crossfilter(data.hours)

    // Magnitude dimension is `dayOfWeek` property, subtract 1 to force 0-index
    const dayCount = ndx.dimension(d => (d.dayOfWeek - 1))
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

    dailyChart
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
      .brushOn(true)
      .round(n => Math.floor(n) + 0.5)
      .alwaysUseRounding(true)

    // Customize axes
    dailyChart.xAxis().tickFormat(d => dayLabel[d])
    dailyChart.yAxis().ticks(5)

    dc.renderAll()
  }

  render () {
    return (
      <Segment>
        <Header>Speed by day of week</Header>

        <div ref={(ref) => { this.dailyChart = ref }} />
      </Segment>
    )
  }
}
