import FileSaver from 'file-saver'

/**
 * Takes a JavaScript object that would be a valid GeoJSON file when converted
 * to JSON. The file is then saved automatically.
 *
 * @param {Object} obj
 */
export function exportData (obj, name) {
  const str = JSON.stringify(obj, null, 2)
  const blob = new Blob([str], { type: 'application/json;charset=utf-8' })
  const filename = name || 'untitled'

  FileSaver.saveAs(blob, `${filename}.geojson`)
}
