/* global map */

// Store for existing bounds.
const bounds = []
let handlersAdded = false

/**
 * Removes an existing bounds.
 *
 * @param {Number} index - remove the bounds at this index in the cache.
 *          Defaults to the earliest bounds (at index 0).
 */
function removeExistingBounds (index = 0) {
  if (bounds[index] && bounds[index].remove) {
    // Manual cleanup on Leaflet
    bounds[index].remove()

    // Remove from memory
    bounds.splice(index, 1)
  }
}

/**
 * Sets the appearance and interactivity of a boundary to be in disabled state.
 *
 * @param {LatLngBounds} bound - boundary object to change.
 */
function setBoundToDisabledAppearance (bound) {
  bound.setStyle({
    weight: 1,
    color: '#aaa',
    fill: '#aaa',
    fillOpacity: 0,
    dashArray: [5, 3]
  })
  bound._path.classList.add('map-bounding-box-disabled')
  bound.editor.disable()
}

/**
 * Function for drawing new viewport bounds.
 *
 * @param {Object} event - from onClick handler
 * @param {Function} callback - optional. Callback function to call after the
 *          bounds has finished drawing.
 */
export function startDrawingBounds (callback) {
  if (!handlersAdded) {
    map.on('editable:drawing:commit', function (event) {
      // The newly created rectangle is stored at `event.layer`
      bounds.push(event.layer)

      // Remove previous bounds after the new one has been drawn.
      if (bounds.length > 1) {
        removeExistingBounds(0)
      }

      // Get the bounds object of the layer and return it in the callback function.
      if (typeof callback === 'function') {
        callback(event.layer.getBounds())
      }
    })

    // TODO: Handle canceling.

    handlersAdded = true
  }

  // Remove the handles on existing bounds, but don't remove yet. It remains
  // as a "ghost" so that it can be referenced when new bounds are drawn over it.
  if (bounds.length) {
    bounds.forEach(setBoundToDisabledAppearance)
  }

  map.editTools.startRectangle()
}
