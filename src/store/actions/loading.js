import { SET_LOADING, STOP_LOADING } from '../actions'

export function setLoading() {
  type: SET_LOADING
}

export function stopLoading() {
  type: STOP_LOADING
}

