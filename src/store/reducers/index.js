import { combineReducers } from 'redux'
import app from './app'
import config from './config'
import date from './date'
import errors from './errors'
import map from './map'
import route from './route'
import viewBounds from './viewBounds'
import loading from './loading'

const reducers = combineReducers({
  app,
  config,
  date,
  errors,
  map,
  route,
  viewBounds,
  loading
})

export default reducers
