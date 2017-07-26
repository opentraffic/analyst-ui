import { ADD_ERROR, REMOVE_ERROR, CLEAR_ERRORS } from '../actions'

// Action creators
export function addError (error) {
  return {
    type: ADD_ERROR,
    error
  }
}

export function removeError (error) {
  return {
    type: REMOVE_ERROR,
    error
  }
}

export function clearErrors () {
  return {
    type: CLEAR_ERRORS
  }
}
