import { uniqWith, reject, isEqual } from 'lodash'

// Actions
export const ADD_ERROR = 'analyst-ui/errors/ADD_ERROR'
export const REMOVE_ERROR = 'analyst-ui/errors/REMOVE_ERROR'
export const CLEAR_ERRORS = 'analyst-ui/errors/CLEAR_ERRORS'

// Reducer
const initialState = {
  errors: []
}

const errors = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ERROR: {
      // Append an error object the current list of errors.
      // Filter out identical errors.
      const errorsCollection = [...state.errors, action.error]

      return {
        ...state,
        errors: uniqWith(errorsCollection, isEqual)
      }
    }
    case REMOVE_ERROR: {
      return {
        ...state,
        errors: reject(state.errors, action.error)
      }
    }
    case CLEAR_ERRORS:
      return initialState
    default:
      return state
  }
}

export default errors

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
