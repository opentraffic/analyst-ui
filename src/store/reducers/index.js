import { combineReducers } from 'redux'
import config from './config'
import date from './date'
import errors from './errors'
import route from './route'

const reducers = combineReducers({
  config,
  date,
  errors,
  route
})

export default reducers
