// Turn query string into an object with key/value
export function getQueryStringObject (queryString = window.location.search) {
  const params = new URLSearchParams(queryString)
  const queryObject = {}

  for (const param of params.entries()) {
    const [key, value] = param

    // Do not add to object if key is blank string or value is undefined
    if (key !== '' && typeof value !== 'undefined') {
      queryObject[key] = value
    }
  }

  return queryObject
}

// Parsing query string to return certain parameter
export function parseQueryString (param, queryString = window.location.search) {
  const params = new URLSearchParams(queryString)
  return params.get(param)
}

// Adding new parameter to query string
// If no query string, empty URLSearchParams object is created
export function addNewParam (params = {}, queryString = window.location.search) {
  const searchParams = new URLSearchParams(queryString)

  for (var param in params) {
    const [key, value] = [param, params[param]]

    // If no value, delete key
    if (value === null) {
      searchParams.delete(key)
    } else {
      searchParams.set(key, value)
    }
  })

  const newQueryString = `?${searchParams.toString()}`
  return newQueryString
}

// Replace existing history state
export function updateURL (params = {}) {
  const locationPrefix = window.location.pathname
  const queryString = addNewParam(params)
  window.history.replaceState({}, null, locationPrefix + queryString)
}
