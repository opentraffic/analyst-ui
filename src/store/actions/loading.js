import { START_LOADING, STOP_LOADING, HIDE_LOADING } from '../actions'

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

export function hideLoading () {
  return {
    type: HIDE_LOADING
  }
}
