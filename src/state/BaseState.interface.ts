export interface BaseState {
  init: () => void
  update: (deltaTime: number) => void
  teardown: () => void
}
