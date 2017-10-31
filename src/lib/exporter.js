import FileSaver from 'file-saver'
import _ from 'lodash'

/**
 * Based on https://appendto.com/2017/04/use-javascript-to-export-your-data-as-csv/
 * @param {Object} data
 * @param {String} columnDelimiter
 * @param {String} lineDelimiter
 */
function convertArrayOfObjectsToCsv (data, columnDelimiter = ',', lineDelimiter = '\n') {
  var result,
    ctr,
    keys

  if (data == null || !data.length) {
    return null
  }

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
export function exportData (obj, name = 'untitled', format = 'geojson', analysisMode, date, route) {
  // Do nothing if obj is falsy
  if (!obj) return false

  let blob

  if (format === 'geojson') {
    let str = JSON.stringify(obj, null, 2)
    blob = new Blob([str], {type: 'application/json;charset=utf-8'})
  } else if (format === 'csv') {
    let rows = []
    if (analysisMode === 'ROUTE') {
      rows.push({
        'row_type': 'route_summary',
        'baseline_route_time': route.baselineTime,
        'traffic_route_time': route.trafficRouteTime
      })
    }
    rows = rows.concat(_.map(obj.features, (segment) => {
      var row = {
        'row_type': 'segment',
        'osmlr_id': segment.properties.osmlr_id
      }
      const daysOfWeek = [null, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      segment.properties.speedByHour.forEach((speedByHour) => {
        let dayOfWeek = daysOfWeek[speedByHour.dayOfWeek]
        row[`average_speed_on_${dayOfWeek}_at_hour_${speedByHour.hourOfDay}`] = speedByHour.speedThisHour
      })
      return row
    }))
    let str = convertArrayOfObjectsToCsv(rows)
    blob = new Blob([str], {type: 'text/csv;charset=utf-8'})
  } else {
    throw new Error('exportData() only supports GeoJSON or CSV formats')
  }
  FileSaver.saveAs(blob, `open-traffic-${analysisMode}-${name}.${format}`)
}
