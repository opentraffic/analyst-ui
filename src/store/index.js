import { createStore, applyMiddleware, compose } from 'redux'
import { persistState } from 'redux-devtools'
import thunk from 'redux-thunk'

import DevTools from '../components/DevTools'
import reducers from './reducers'

const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  DevTools.instrument(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
))

export default store
