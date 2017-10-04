import { SET_ANALYSIS_MODE, CLEAR_ANALYSIS, SET_ANALYSIS_NAME, SET_REF_SPEED_COMPARISON_ENABLED } from '../actions'

const ROUTE_MODE = 'ROUTE'
const REGION_MODE = 'REGION'

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
  return { type: CLEAR_ANALYSIS }
}

export function setAnalysisName (viewName) {
  return {
    type: SET_ANALYSIS_NAME,
    viewName: viewName.trim()
  }
}

export function setRefSpeedComparisonEnabled (newState) {
  return {
    type: SET_REF_SPEED_COMPARISON_ENABLED,
    refSpeedComparisonEnabled: newState
  }
}
