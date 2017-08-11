import { START_LOADING, STOP_LOADING } from '../actions'

export function startLoading () {
  return {
    type: START_LOADING
  }
}

export function stopLoading () {
  return {
    type: STOP_LOADING
  }
}
