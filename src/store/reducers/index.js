import { combineReducers } from 'redux'
import config from './config'
import date from './date'
import mapLocation from './mapLocation'

const reducers = combineReducers({
  config, 
  date, 
  mapLocation
})

export default reducers
