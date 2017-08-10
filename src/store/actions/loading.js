import { START_LOADING, STOP_LOADING } from '../actions'

export function setLoading () {
  return {
    type: START_LOADING
  }
}

export function stopLoading () {
  return {
    type: STOP_LOADING
  }
}
