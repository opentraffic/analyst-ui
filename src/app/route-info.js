let featureFlag = false
let featureInfo

export function displayRegionInfo(selection) {
  // if feature is null, that means it is not a route
  if (!selection.feature || !selection.feature.properties.osmlr_id) {
    // if a feature info box exists but mouse is not over a route anymore
    // remove the feature info box and set featureFlag to false
    if (featureFlag) removeInfo()
    // then break out of the function
    return
  }
  // if there is no feature info box yet but mouse is over a route
  // create the feature info box
  if (!featureFlag) createFeatureInfo()
  //once feature info box is created or if it already existed
  // set the position of the box to be near the route the mouse is hovering over
  setPosition(selection.pixel.x, selection.pixel.y)
  // write the data you want in the feature info box
  const { speed, osmlr_id, id } = selection.feature.properties
  // console.log(selection.feature)
  featureInfo.innerHTML =
    `<p> SPEED: ${ speed ? speed.toFixed(2) : 0 } kph <br/>
         OSMLR_ID: ${osmlr_id} <br/>
         ID: ${id} <br/>
     </p>`
}

function createFeatureInfo() {
  featureInfo = document.createElement('div')
  featureInfo.setAttribute('class', 'feature-info')
  window.map.getContainer().appendChild(featureInfo)
  featureFlag = true
}

function setPosition(left, top) {
  featureInfo.style.left = (left + 10) + 'px'
  featureInfo.style.top = (top + 15) + 'px'
}

export function removeInfo() {
  if (featureFlag) {
    featureInfo.parentNode.removeChild(featureInfo)
    featureFlag = false
  }
}

export function displayRouteInfo(event, selection) {
  if (!featureFlag) createFeatureInfo()
  setPosition(event.containerPoint.x, event.containerPoint.y)
  const { speed, id, tile, segment } = selection.properties
  featureInfo.innerHTML =
    `<p> SPEED: ${ speed ? speed.toFixed(2) : 0 } kph <br/>
         ID: ${id} <br/>
         SEGMENT: ${segment} <br/>
         TILE: ${tile}
     </p>`
}
