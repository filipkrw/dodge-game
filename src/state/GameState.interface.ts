export interface GameState {
  init: () => void
  update: (deltaTime: number) => void
  teardown: () => void
}
