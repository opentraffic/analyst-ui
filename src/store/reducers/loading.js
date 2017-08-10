import { SET_LOADING, STOP_LOADING } from '../actions'

const initialState = {
  isLoading: false,
  counter: 0
}

const loading = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: true,
        counter: state.counter + 1
      }
    case STOP_LOADING:
      return {
        ...state,
        isLoading: state.counter - 1 === 0,
        counter: state.counter - 1
      }
    default:
      return state
  }
}

export default loading

