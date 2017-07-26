// Constants
const ROUTE_MODE = 'ROUTE'
const REGION_MODE = 'REGION'

// Actions
const SET_ANALYSIS_MODE = 'analyst-ui/app/SET_ANALYSIS_MODE'
const CLEAR_ANALYSIS_MODE = 'analyst-ui/app/CLEAR_ANALYSIS_MODE'

// Reducer
const initialState = {
  analysisMode: null
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_ANALYSIS_MODE:
      return {
        ...state,
        analysisMode: action.mode
      }
    case CLEAR_ANALYSIS_MODE:
      return {
        ...state,
        analysisMode: null
      }
    default:
      return state
  }
}

// Action creators
function setAnalysisMode (mode) {
  return {
    type: SET_ANALYSIS_MODE,
    mode
  }
}

export function setRegionAnalysisMode () {
  return setAnalysisMode(REGION_MODE)
}

export function setRouteAnalysisMode () {
  return setAnalysisMode(ROUTE_MODE)
}

export function clearAnalysisMode () {
  return { type: CLEAR_ANALYSIS_MODE }
}
