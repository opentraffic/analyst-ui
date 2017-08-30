import dc from 'dc'
import * as d3 from 'd3'

// Reduce functions
// https://github.com/square/crossfilter/wiki/API-Reference#group_reduce

// Callback for when data is added to the current filter results
const reduceAdd = function (p, v) {
  p.count += v.c
  p.sum += v.s
  if (p.count > 0) {
    p.avg = (p.sum / p.count)
  } else {
    p.avg = 0
  }
  return p
}

// Callback for when data is removed from the current filter results
const reduceRemove = function (p, v) {
  p.count -= v.c
  p.sum -= v.s
  if (p.count > 0) {
    p.avg = (p.sum / p.count)
  } else {
    p.avg = 0
  }
  return p
}

// Initialize `p`
const reduceInitial = function () {
  return {
    count: 0,
    sum: 0,
    avg: 0
  }
}

/**
 * Creates a DC-based chart for time filtering with crossfilter'd data.
 * If additional customizability is desired, edit this function by providing
 * more properties to the second argument `opts`.
 *
 * @param {HTMLElement} el - the element which to append the chart to. The
 *            element reference may be created from a React ref, for example.
 * @param {Object} opts - all the 'custom' properties that can be edited to
 *            provide the desired behavior.
 *            - data - the data to use. This must be the object returned from
 *                Crossfilter already.
 *            - dimension - an accessor function to construct a dimension on.
 *                see Crossfilter documentation for more info.
 *            - xDomain - an array [x1, x2] to act as the domain of the x-axis.
 *                use values of 0.5 above and below the actual desired range
 *                because of how bars will be centered on x-axis ticks.
 *                Documentation: https://github.com/d3/d3-3.x-api-reference/blob/master/Quantitative-Scales.md#linear
 *            - gap - spacing between bars.
 *                see dc.js documentation.
 *            - onExtentChange - a callback function called with one argument
 *                of `extents`, an array containing the range of the filter
 *                brush extents. This can be used in the caller scope to
 *                set component state.
 * @return {dc.barChart} - chart object
 */

export function createChart (el, opts) {
  // Data should be crossfilter'd
  const data = opts.data

  // Get dimension and group (Crossfilter methods)
  // https://github.com/square/crossfilter/wiki/API-Reference
  const dimension = data.dimension(opts.dimension)
  const group = dimension.group().reduce(reduceAdd, reduceRemove, reduceInitial)

  // Create the chart (using DC)
  // https://dc-js.github.io/dc.js/docs/html/dc.barChart.html
  const chart = dc.barChart(el)

  // Configure the chart
  chart
    .width(410)
    .height(150)
    .margins({top: 5, right: 10, bottom: 20, left: 30})
    .dimension(dimension)
    .group(group)
    .transitionDuration(0)
    // X-axis placement and formatting
    .valueAccessor(p => p.value.avg)
    .x(d3.scale.linear().domain(opts.xDomain))
    .centerBar(true)
    .gap(opts.gap)
    // Y-axis
    .renderHorizontalGridLines(true)
    .elasticY(true)
    // Filter brush
    // The filter is initially off (because if it is on by default, it can
    // introduce undesirable interaction effects).
    // We also force the brush to snap to the space between bars
    .brushOn(false)
    .round(n => Math.floor(n) + 0.5)
    .alwaysUseRounding(true)

  // Do not configure axes here.

  // Set up handler for brush filtering
  chart.brush().on('brushend.custom', () => {
    const extent = chart.brush().extent()

    // Callback function to work with the extent change
    opts.onExtentChange(extent)
  })

  return chart
}
