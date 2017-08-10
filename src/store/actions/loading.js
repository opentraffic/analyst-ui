import { START_LOADING, STOP_LOADING } from '../actions'

export function setLoading() {
  type: START_LOADING
}

export function stopLoading() {
  type: STOP_LOADING
}

