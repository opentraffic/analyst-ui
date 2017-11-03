import FileSaver from 'file-saver'
import _ from 'lodash'

const DAYS_OF_WEEK = [null, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

function prepareCsvForExport (data, analysisMode, refSpeedComparisonEnabled, route) {
  let rows = []
  if (analysisMode === 'ROUTE') {
    rows.push({
      'row_type': 'route_summary',
      'baseline_route_time': route.baselineTime,
      'traffic_route_time': route.trafficRouteTime
    })
  }

  rows = rows.concat(_.map(data.features, (segment) => {
    var row = {
      'row_type': 'segment',
      'osmlr_id': segment.properties.osmlr_id
    }
    if (refSpeedComparisonEnabled) {
      row['percent_diff_from_reference_speed'] = segment.properties.percentDiff
    } else {
      segment.properties.speedByHour.forEach((speedByHour) => {
        let dayOfWeek = DAYS_OF_WEEK[speedByHour.dayOfWeek]
        row[`average_speed_on_${dayOfWeek}_at_hour_${speedByHour.hourOfDay}`] = speedByHour.speedThisHour
      })
    }
    return row
  }))
  let str = convertArrayOfObjectsToCsv(rows)
  return str
}

/**
 * Takes in an array of objects, creates CSV in a big string that includes
 * header columns for all of the possible object keys.
 * Based on https://appendto.com/2017/04/use-javascript-to-export-your-data-as-csv/
 * @param {Object} data
 * @param {String} columnDelimiter
 * @param {String} lineDelimiter
 */
export function convertArrayOfObjectsToCsv (data, columnDelimiter = ',', lineDelimiter = '\n') {
  var result,
    ctr,
    keys

  if (data == null || !data.length) {
    return null
  }

  // collect together all possible column names
  keys = _.chain(data).map(_.keys).flatten().uniq().value()

  result = ''
  result += keys.join(columnDelimiter)
  result += lineDelimiter

  data.forEach(function (item) {
    ctr = 0
    keys.forEach(function (key) {
      if (ctr > 0) {
        result += columnDelimiter
      }
      if (item[key]) {
        result += item[key]
      }
      ctr++
    })
    result += lineDelimiter
  })

  return result
}

/**
 * Turns a JavaScript object into a file formatted as either GeoJSON or CSV
 * for saving locally by the web browser.
 * @param {Object} obj
 * @param {String} name
 * @param {String} format
 * @param {String} analysisMode
 * @param {Object} date
 * @param {Object} route
 */
export function exportData (obj, name = 'untitled', format = 'geojson', analysisMode, date, refSpeedComparisonEnabled, route) {
  if (!obj) return false

  let blob

  let data = JSON.parse(JSON.stringify(obj)) // deep clone, so we can modify the data

  data.properties.analysisMode = analysisMode
  data.properties.analysisName = name
  const days = (date && date.dayFilter) ? _.slice(DAYS_OF_WEEK, date.dayFilter[0] + 1, date.dayFilter[1] + 1) : _.slice(DAYS_OF_WEEK, 1, 8)
  const hours = (date && date.hourFilter) ? _.range(date.hourFilter[0], date.hourFilter[1]) : _.range(0, 25)
  data.properties.date = {
    year: date.year,
    week: parseInt(date.week, 10),
    days: days,
    hours: hours
  }

  if (refSpeedComparisonEnabled) {
    data.features = data.features.map((feature) => {
      delete feature.properties.speedByHour
      delete feature.properties.speed
      return feature
    })
  } else {
    data.features = data.features.map((feature) => {
      delete feature.properties.percentDiff
      return feature
    })
  }

  if (format === 'geojson') {
    let str = JSON.stringify(data, null, 2)
    blob = new Blob([str], {type: 'application/json;charset=utf-8'})
  } else if (format === 'csv') {
    let str = prepareCsvForExport(data, analysisMode, refSpeedComparisonEnabled, route)
    blob = new Blob([str], {type: 'text/csv;charset=utf-8'})
  } else {
    throw new Error('exportData() only supports GeoJSON or CSV formats')
  }
  FileSaver.saveAs(blob, `${['open', 'traffic', analysisMode, name].join('-')}.${format}`)
}
