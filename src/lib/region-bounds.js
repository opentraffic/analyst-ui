/* global map */

// Store for existing bounds.
const bounds = []
let handlersAdded = false

// Removes an existing bounds.
function removeExistingBounds (index = 0) {
  if (bounds[index] && bounds[index].remove) {
    // Manual cleanup on Leaflet
    bounds[index].remove()

    // Remove from memory
    bounds.splice(index, 1)
  }
}

export function onClickDrawRectangle (event) {
  if (!handlersAdded) {
    map.on('editable:drawing:commit', function (event) {
      // The newly created rectangle is stored at `event.layer`
      const theBounds = event.layer.getBounds()
      bounds.push(event.layer)
      console.log(theBounds.getWest(), theBounds.getSouth(), theBounds.getEast(), theBounds.getNorth())

      // Remove previous bounds after the new one has been drawn.
      if (bounds.length > 1) {
        removeExistingBounds(0)
      }
    })

    handlersAdded = true
  }

  // Remove the handles on existing bounds, but don't remove yet. It remains
  // as a "ghost" so that it can be referenced when new bounds are drawn over it.
  if (bounds.length) {
    bounds.forEach(bound => {
      bound.setStyle({
        weight: 1,
        color: '#aaa',
        fill: '#aaa'
      })
      bound._path.classList.add('map-bounding-box-disabled')
      bound.editor.disable()
    })
  }

  map.editTools.startRectangle()
}
