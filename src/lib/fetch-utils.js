/**
 * Wrapper around Fetch API which can interact with a resource that will
 * return a JSON payload along with an unsuccessful HTTP status code.
 * https://github.com/github/fetch/issues/203
 */

/**
 * Parses the JSON returned by a network request
 *
 * @param {object} response - A response from a network request
 *
 * @return {object} - The parsed JSON, status from the response
 */
function parseJSON (response) {
  return new Promise(resolve => response.json()
    .then(json => resolve({
      status: response.status,
      ok: response.ok,
      json
    })))
}

/**
 * Requests a URL, returning a promise
 *
 * @param {string} url - The URL we want to request
 * @param {object} options - The options we want to pass to window.fetch()
 *
 * @return {Promise} - The request promise
 */
export function request (url, options) {
  return new Promise((resolve, reject) => {
    window.fetch(url, options)
      .then(parseJSON)
      .then(response => {
        if (response.ok) {
          return resolve(response.json)
        }

        // Send error payload from the server's json
        return reject(response.json)
      })
      .catch(error => reject(new Error(error.message)))
  })
}
