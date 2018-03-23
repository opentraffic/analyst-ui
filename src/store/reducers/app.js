import { SET_ANALYSIS_MODE, CLEAR_ANALYSIS, SET_ANALYSIS_NAME, SET_REF_SPEED_COMPARISON_ENABLED, SET_REF_SPEED_ENABLED } from '../actions'

const initialState = {
  analysisMode: null,
  viewName: '',
  refSpeedComparisonEnabled: false,
  refSpeedEnabled: false
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
        analysisMode: null,
        refSpeedComparisonEnabled: false,
        refSpeedEnabled: false
      }
    case SET_ANALYSIS_NAME:
      return {
        ...state,
        viewName: action.viewName
      }
    case SET_REF_SPEED_COMPARISON_ENABLED:
      return {
        ...state,
        refSpeedComparisonEnabled: action.refSpeedComparisonEnabled
      }
    case SET_REF_SPEED_ENABLED:
      return {
        ...state,
        refSpeedEnabled: action.refSpeedEnabled
      }
    default:
      return state
  }
}

export default app
