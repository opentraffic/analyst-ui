import { combineReducers } from 'redux'
import config from './config'
import date from './date'
import errors from './errors'
import map from './map'
import route from './route'

const reducers = combineReducers({
  config,
  date,
  errors,
  map,
  route
})

export default reducers
