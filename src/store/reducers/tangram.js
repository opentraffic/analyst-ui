import { UPDATE_SCENE } from '../actions'

const initialState = {
  scene: {}
}

const tangram = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SCENE:
      return {
        ...state,
        scene: Object.assign({}, state.scene, action.scene)
      }
    default:
      return state
  }
}

export default tangram
