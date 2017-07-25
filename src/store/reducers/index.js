import { combineReducers } from 'redux'
import config from './config'
import date from './date'
import errors from './errors'
import map from './map'
import route from './route'
import viewBounds from './viewBounds'

const reducers = combineReducers({
  config,
  date,
  errors,
  map,
  route,
  viewBounds
})

export default reducers
