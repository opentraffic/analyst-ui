// Abstractions for working with Tangram.

let tangramLayer

export function storeReferenceToTangramLayer (layer) {
  tangramLayer = layer

  // Expose globally for debug access.
  window.tangramLayer = tangramLayer
}

export function getTangramLayer () {
	if (!tangramLayer) return
	return tangramLayer
}

/**
 * Add a data source to a scene. If the data source doesn't exist, it will create it.
 *
 * @param {String} name - name of the data source.
 * @param {Object} config - a config object that looks like this:
 *            { type: 'GeoJSON',
 *              data: geojson_data }
 *            (where `geojson_data` is a Javascript object)
 *            You can also pass { url: <string> } in lieu of data.
 *            For other valid values of `type`, see Tangram documentation.
 * @return {Promise}
 */
export function setDataSource (name, config) {
  if (!tangramLayer) return
  return tangramLayer.scene.setDataSource(name, config)
}

/**
 * Gets the current scene object from Tangram. This is a clone of the object
 * so you do not mutate the original Tangram instance directly. If you edit the
 * clone of the scene, use `setCurrentScene()` to load it back in.
 *
 * @return {Object}
 */
export function getCurrentScene () {
  if (!tangramLayer) return
  return Object.assign({}, tangramLayer.scene.config)
}

/**
 * Loads a new scene in Tangram. This is an alias for `scene.load()`.
 *
 * @param {String|Object} scene
 * @param {Object} options
 * @return {Promise}
 */
export function setCurrentScene (newScene, options) {
  if (!tangramLayer) return
  return tangramLayer.scene.load(newScene, options)
}
