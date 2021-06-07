import * as Two from 'twojs-ts'

export default class Player {
  two: Two
  pawn: Two.Path
  moveSpeed: number = 300
  goal: Two.Vector

  constructor(two: Two) {
    this.two = two
    this.pawn = this.createPawn()
  }

  moveToGoal(deltaTime: number) {
    const pawnToGoalDistance = this.getDistanceToGoal()
    const t = (this.moveSpeed / pawnToGoalDistance) * deltaTime
    this.pawn.translation.lerp(this.goal, t)
  }

  getDistanceToGoal() {
    return this.pawn.translation.distanceTo(this.goal)
  }

  hasReachedGoal() {
    const pawnToGoalDistance = this.getDistanceToGoal()
    return pawnToGoalDistance < 10
  }

  createPawn(): Two.Path {
    const pawn = this.two.makeCircle(this.two.width / 2, this.two.height / 2, 30)
    pawn.fill = '#FF8000'
    pawn.linewidth = 0
    return pawn
  }

  setGoal(newGoal: Two.Vector) {
    this.goal = newGoal
  }

  update(deltaTime: number) {
    if (this.goal) {
      this.moveToGoal(deltaTime)
      if (this.hasReachedGoal()) {
        this.goal = null
      }
    }
  }

  getPosition() {
    return this.pawn.translation
  }
}
