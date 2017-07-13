import { combineReducers } from 'redux'
import config from './config'
import date from './date'
import errors from './errors'
import route from './route'
import mapLocation from './mapLocation'

const reducers = combineReducers({
  config,
  date,
  errors,
  mapLocation,
  route
})

export default reducers
