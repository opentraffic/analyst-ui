import config from '../config'
import store from '../store'

// Subscribe to changes in state to determine document title
export function initDocTitle () {
  store.subscribe(() => {
    const state = store.getState()
    updateDocTitle(state.app.viewName)
  })
}

function updateDocTitle (value) {
  const defaultTitle = config.name
  if (value) {
    document.title = `${value} | ${defaultTitle}`
  } else {
    document.title = defaultTitle
  }
}
