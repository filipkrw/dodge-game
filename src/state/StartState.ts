import { GameState } from './GameState.interface'

export default class StartState implements GameState {
  init: () => void
  update: (deltaTime: number) => void
  teardown: () => void
}
