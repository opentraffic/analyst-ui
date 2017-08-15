import { START_LOADING, STOP_LOADING, HIDE_LOADING } from '../actions'

const initialState = {
  isLoading: false,
  counter: 0
}

const loading = (state = initialState, action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        isLoading: true,
        counter: state.counter + 1
      }
    case STOP_LOADING:
      return {
        ...state,
        isLoading: state.counter - 1 !== 0,
        counter: state.counter - 1
      }
    case HIDE_LOADING:
      return {
        ...state,
        isLoading: false,
        counter: 0
      }
    default:
      return state
  }
}

export default loading
