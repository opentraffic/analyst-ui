import { UPDATE_SCENE } from '../actions'

export function updateScene (newProps) {
  return {
    type: UPDATE_SCENE,
    scene: newProps
  }
}
