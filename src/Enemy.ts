import * as Two from 'twojs-ts'
import { getRandomIntInRange } from './util'

export default class Enemy {
  two: Two
  pawn: Two.Path
  pawnRadius: number = 20
  direction: Two.Vector
  spawnTime: number

  maxOutOfBoundsSpawnOffset = 100

  constructor(two: Two, goal: Two.Vector) {
    this.two = two
    this.createPawn()
    this.setMovementDirection(goal)
    this.spawnTime = new Date().getTime()
  }

  createPawn() {
    const startingPosition = this.getOutOfBoundsPosition()
    const pawn = this.two.makeCircle(startingPosition.x, startingPosition.y, this.pawnRadius)

    pawn.fill = '#34b4eb'
    pawn.linewidth = 0

    this.pawn = pawn
  }

  getOutOfBoundsPosition(): Two.Vector {
    // const x = getRandomIntInRange(0, this.two.width)
    // const y = getRandomIntInRange(0, this.two.height)
    // return new Two.Vector(x, y)
    if (Math.random() < this.two.width / (this.two.width + this.two.height)) {
      // Enemy spawns top or bottom of the screen
      const x = getRandomIntInRange(0, this.two.width)
      const y =
        Math.random() > 0.5
          ? getRandomIntInRange(-this.maxOutOfBoundsSpawnOffset, 0)
          : getRandomIntInRange(this.two.height, this.two.height + this.maxOutOfBoundsSpawnOffset)
      return new Two.Vector(x, y)
    } else {
      // Enemy spwans left or right of the screen
      const x =
        Math.random() > 0.5
          ? getRandomIntInRange(-this.maxOutOfBoundsSpawnOffset, 0)
          : getRandomIntInRange(this.two.width, this.two.width + this.maxOutOfBoundsSpawnOffset)
      const y = getRandomIntInRange(0, this.two.height)
      return new Two.Vector(x, y)
    }
  }

  isInBounds() {
    if (new Date().getTime() < this.spawnTime + 5000) {
      return true
    }

    const { x, y } = this.pawn.translation
    const { width, height } = this.two

    return (
      x > -this.maxOutOfBoundsSpawnOffset &&
      x < width + this.maxOutOfBoundsSpawnOffset &&
      y > -this.maxOutOfBoundsSpawnOffset &&
      y < height + this.maxOutOfBoundsSpawnOffset
    )
  }

  destroyPawn() {
    this.pawn.remove()
  }

  setMovementDirection(goal: Two.Vector) {
    this.direction = goal.clone().subSelf(this.pawn.translation).normalize()
  }

  update(deltaTime: number) {
    this.pawn.translation.lerp(
      this.pawn.translation.clone().addSelf(this.direction),
      200 * deltaTime
    )
  }
}
