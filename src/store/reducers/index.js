import { combineReducers } from 'redux'
import config from './config'
import date from './date'
import route from './route'

const reducers = combineReducers({
  config,
  date,
  route,
})

export default reducers
