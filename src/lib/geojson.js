// GeoJSON utils.
import normalize from '@mapbox/geojson-normalize'

/**
 * Merge a series of GeoJSON objects into one FeatureCollection containing all
 * features in all files.  The objects can be any valid GeoJSON root object,
 * including FeatureCollection, Feature, and Geometry types.
 *
 * This has been copied from the module `@mapbox/geojson-merge@1.0.2`. The
 * original module is not included because it includes a dependency on `JSONStream`
 * which is not actually needed here, and contains a shebang line that breaks
 * Webpack. (https://github.com/dominictarr/JSONStream/issues/126)
 *
 * @param {Array<Object>} inputs a list of GeoJSON objects of any type
 * @return {Object} a geojson FeatureCollection.
 */
export function merge (inputs) {
  var output = {
    type: 'FeatureCollection',
    features: []
  }
  for (var i = 0; i < inputs.length; i++) {
    var normalized = normalize(inputs[i])
    for (var j = 0; j < normalized.features.length; j++) {
      output.features.push(normalized.features[j])
    }
  }
  return output
}
