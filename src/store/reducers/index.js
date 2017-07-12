import { combineReducers } from 'redux'
import config from './config'
import date from './date'

const reducers = combineReducers({
  config,
  date
})

export default reducers
