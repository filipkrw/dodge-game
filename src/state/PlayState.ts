import { fromEvent, interval, Subscription } from 'rxjs'
import * as Two from 'twojs-ts'
import Enemy from '../Enemy'
import Player from '../Player'
import { Score } from '../Score'
import { BaseState } from './BaseState.interface'

export class PlayState implements BaseState {
  two: Two
  player: Player
  enemies: Array<Enemy> = []
  score: Score
  subscriptions: Array<Subscription> = []

  constructor(two: Two) {
    this.two = two
    this.player = new Player(two)
    this.score = new Score(two)
    this.init()
  }

  init() {
    const movePawn$ = fromEvent(document, 'click').subscribe((event: MouseEvent) => {
      const newGoal = new Two.Vector(event.clientX, event.clientY)
      this.player.setGoal(newGoal)
    })

    const spawnEnemies$ = interval(2000).subscribe(() => {
      this.enemies.push(new Enemy(this.two, this.player.getPosition()))
    })

    const incrementScore$ = interval(1000).subscribe(() => {
      this.score.increment()
    })

    this.subscriptions = [movePawn$, spawnEnemies$, incrementScore$]
  }

  update(deltaTime: number) {
    this.player.update(deltaTime)

    this.enemies = this.enemies.filter((enemy) => {
      const isInBounds = enemy.isInBounds()
      if (!isInBounds) {
        enemy.destroyPawn()
      }
      return isInBounds
    })

    this.enemies.forEach((enemy) => enemy.update(deltaTime))
    this.score.update()
  }

  teardown() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  spawnEnemy() {
    const newEnemy = new Enemy(this.two, this.player.getPosition())
    this.enemies.push(newEnemy)
  }
}
