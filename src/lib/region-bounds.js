/* global map */
import store from '../store'
import { setBounds } from '../store/actions/viewBounds'
import { updateURL } from './url-state'

// Store for existing bounds.
const bounds = []
let handlersAdded = false

// Subscribe to changes in state to affect the behavior of Leaflet.Editable.
store.subscribe(() => {
  const state = store.getState()

  // If bounds are cleared from state, remove current bounds.
  if (!state.viewBounds.bounds) removeAllExistingBounds()

  // If select mode has changed, stop any existing drawing interaction.
  if (state.app.analysisMode !== 'REGION' && typeof map !== 'undefined' && map.editTools) {
    map.editTools.stopDrawing()
  }
})

function removeBoundsFromURL () {
  updateURL({
    rn: null,
    rs: null,
    re: null,
    rw: null
  })
}

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

function removeAllExistingBounds () {
  while (bounds.length) {
    bounds[0].remove()
    bounds.shift()
  }

  removeBoundsFromURL()
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

function onDrawingFinished (event) {
  // The newly created rectangle is stored at `event.layer`
  bounds.push(event.layer)

  // Remove previous bounds after the new one has been drawn.
  if (bounds.length > 1) {
    removeExistingBounds(0)
  }
}

function onDrawingEdited (event) {
  const bounds = event.layer.getBounds()
  const precision = 6
  const north = bounds.getNorth().toFixed(precision)
  const south = bounds.getSouth().toFixed(precision)
  const east = bounds.getEast().toFixed(precision)
  const west = bounds.getWest().toFixed(precision)

  // Store it.
  store.dispatch(setBounds({ north, south, east, west }))

  // Update URL
  updateURL({
    rn: north,
    rs: south,
    re: east,
    rw: west
  })
}

function addEventListeners () {
  map.on('editable:drawing:commit', onDrawingFinished)
  map.on('editable:vertex:dragend', onDrawingEdited)
}

/**
 * Function for drawing new viewport bounds.
 *
 * @param {Object} event - from onClick handler
 * @param {Function} callback - optional. Callback function to call after the
 *          bounds has finished drawing.
 */
export function startDrawingBounds () {
  if (!handlersAdded) {
    addEventListeners()
    handlersAdded = true
  }

  // Remove the handles on existing bounds, but don't remove yet. It remains
  // as a "ghost" so that it can be referenced when new bounds are drawn over it.
  if (bounds.length) {
    bounds.forEach(setBoundToDisabledAppearance)
  }

  map.editTools.startRectangle()
}
