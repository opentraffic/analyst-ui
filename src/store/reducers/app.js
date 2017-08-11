import { SET_ANALYSIS_MODE, CLEAR_ANALYSIS, SET_ANALYSIS_NAME } from '../actions'

const initialState = {
  analysisMode: null,
  viewName: '',
  tempHour: 23
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case SET_ANALYSIS_MODE:
      return {
        ...state,
        analysisMode: action.mode
      }
    case CLEAR_ANALYSIS:
      return {
        ...state,
        analysisMode: null
      }
    case SET_ANALYSIS_NAME:
      return {
        ...state,
        viewName: action.viewName
      }
    case 'set_hour':
      return {
        ...state,
        tempHour: action.value
      }
    default:
      return state
  }
}

export default app
