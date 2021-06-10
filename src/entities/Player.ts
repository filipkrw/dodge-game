import * as Two from 'twojs-ts'
import Enemy from './Enemy'

export default class Player {
  two: Two
  pawn: Two.Circle
  pawnRadius: number = 30
  moveSpeed: number = 300
  goal: Two.Vector

  constructor(two: Two, layer: Two.Group) {
    this.two = two
    this.pawn = this.createPawn()
    layer.add(this.pawn)
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
    const pawn = this.two.makeCircle(this.two.width / 2, this.two.height / 2, this.pawnRadius)
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

  isCollidingWithEnemy(enemy: Enemy) {
    const playerToEnemyDistance = this.pawn.translation.distanceTo(enemy.pawn.translation)
    return playerToEnemyDistance + 5 < this.pawnRadius + enemy.pawnRadius
  }

  reset() {
    const middleOfScreen = new Two.Vector(this.two.width / 2, this.two.height / 2)
    this.pawn.translation = middleOfScreen
    this.goal = null
  }
}
