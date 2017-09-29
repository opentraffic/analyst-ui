/* global map, L */
import store from '../store'
import { setBounds } from '../store/actions/view'
import { getBboxArea } from './region'

// Store for existing bounds.
const bounds = []
let handlersAdded = false
let shades = false

// Subscribe to changes in state to affect the behavior of Leaflet.Editable.
store.subscribe(() => {
  const state = store.getState()
  // If bounds are cleared from state, remove current bounds.
  if (!state.view.bounds) removeAllExistingBounds()

  // While data is still being rendered, disable interactivity of bounds
  if (state.loading.isLoading && bounds.length) {
    bounds.forEach(function (bound) {
      bound.editor.disable()
      bound.dragging.disable()
    })
  }
  if (!state.loading.isLoading && bounds.length) {
    bounds.forEach(function (bound) {
      bound.editor.enable()
      bound.dragging.enable()
    })
  }

  // If select mode has changed, stop any existing drawing interaction.
  if (state.app.analysisMode !== 'REGION' && typeof map !== 'undefined' && map.editTools) {
    map.editTools.stopDrawing()
  }
})

function compareRegionAndMap(bounds) {
  const regionBounds = bounds[0].getBounds()
  const northEastPoint = map.latLngToContainerPoint(regionBounds.getNorthEast())
  const southWestPoint = map.latLngToContainerPoint(regionBounds.getSouthWest())
  const bbox = {
    north: northEastPoint.x,
    east: northEastPoint.y,
    south: southWestPoint.x,
    west: southWestPoint.y
  }
  const regionArea = getBboxArea(bbox)
  const mapSize = map.getSize()
  const mapArea = mapSize.x * mapSize.y
  return regionArea / mapArea > 0.5
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

function storeBounds (bounds) {
  const precision = 6
  const north = bounds.getNorth().toFixed(precision)
  const south = bounds.getSouth().toFixed(precision)
  const east = bounds.getEast().toFixed(precision)
  const west = bounds.getWest().toFixed(precision)

  // Store it.
  store.dispatch(setBounds({ north, south, east, west }))
}

function onDrawingFinished (event) {
  // The newly created rectangle is stored at `event.layer`
  bounds.push(event.layer)
  // If the region shades do not exist, create them
  if (!shades) { createShades(event.layer) }

  // Remove previous bounds after the new one has been drawn.
  if (bounds.length > 1) {
    removeExistingBounds(0)
  }
}

function onDrawingEdited (event) {
  storeBounds(event.layer.getBounds())
  updateShades(event.layer)
}

function addEventListeners () {
  map.on('editable:drawing:commit', onDrawingFinished)
  map.on('editable:vertex:dragend', onDrawingEdited)
  map.on('editable:dragend', onDrawingEdited)
  map.on('moveend', function () { updateShades(bounds[0]) })
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

export function drawBounds ({ west, south, east, north }) {
  const rect = L.rectangle([
    [north, west],
    [south, east]
  ]).addTo(map)
  rect.enableEdit()
  createShades(rect)

  if (!handlersAdded) {
    addEventListeners()
    handlersAdded = true
  }
  bounds.push(rect)
  storeBounds(rect.getBounds())
}

function createShades (rect) {
  // If there are shades already, don't create more
  if (shades) { return }
  // Set shades to true since now shades exist
  shades = true
  const regionSelector = map._panes.overlayPane
  map._shadeContainer = L.DomUtil.create('div', 'leaflet-areaselect-container', regionSelector)
  map._topShade = L.DomUtil.create('div', 'leaflet-areaselect-shade', map._shadeContainer)
  map._bottomShade = L.DomUtil.create('div', 'leaflet-areaselect-shade', map._shadeContainer)
  map._leftShade = L.DomUtil.create('div', 'leaflet-areaselect-shade', map._shadeContainer)
  map._rightShade = L.DomUtil.create('div', 'leaflet-areaselect-shade', map._shadeContainer)
  updateShades(rect)
}

// Setting the dimensions (width, height) and position (top, left) of a shade
function setDimensions (element, dimension) {
  element.style.width = dimension.width + 'px'
  element.style.height = dimension.height + 'px'
  element.style.top = dimension.top + 'px'
  element.style.left = dimension.left + 'px'
}

// When map is zoomed in/out and/or moved, get the offset for the origin zoom and lat/lng values
function getOffset () {
  // Getting the transformation value through style attributes
  let transformation = map.getPanes().mapPane.style.transform
  const startIndex = transformation.indexOf('(')
  const endIndex = transformation.indexOf(')')
  transformation = transformation.substring(startIndex + 1, endIndex).split(',')
  const offset = {
    x: Number(transformation[0].slice(0, -2) * -1),
    y: Number(transformation[1].slice(0, -2) * -1)
  }
  return offset
}

// Calculating values for the dimensions and positions of each shade
function updateShades (rect) {
  // Checking if there are shades to update
  if (!shades) return

  const rectBounds = rect.getBounds()
  const size = map.getSize()
  const offset = getOffset()

  const northEastPoint = map.latLngToContainerPoint(rectBounds.getNorthEast())
  const southWestPoint = map.latLngToContainerPoint(rectBounds.getSouthWest())

  setDimensions(map._topShade, {
    width: size.x,
    height: (northEastPoint.y < 0) ? 0 : northEastPoint.y,
    top: offset.y,
    left: offset.x
  })

  setDimensions(map._bottomShade, {
    width: size.x,
    height: size.y - southWestPoint.y,
    top: southWestPoint.y + offset.y,
    left: offset.x
  })

  setDimensions(map._leftShade, {
    width: (southWestPoint.x < 0) ? 0 : southWestPoint.x,
    height: southWestPoint.y - northEastPoint.y,
    top: northEastPoint.y + offset.y,
    left: offset.x
  })

  setDimensions(map._rightShade, {
    width: size.x - northEastPoint.x,
    height: southWestPoint.y - northEastPoint.y,
    top: northEastPoint.y + offset.y,
    left: northEastPoint.x + offset.x
  })
}

export function removeShades () {
  // If shades exist remove it
  if (shades) { L.DomUtil.remove(map._shadeContainer) }
  // Set shades to false, since shades rae now removed
  shades = false
}
