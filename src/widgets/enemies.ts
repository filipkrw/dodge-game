import { of, timer } from 'rxjs'
import { combineLatestWith, map, takeWhile, withLatestFrom } from 'rxjs/operators'
import * as Two from 'twojs-ts'
import { deltaTime$ } from './deltaTime'
import Enemy from '../entities/Enemy'
import Player from '../entities/Player'
import { Score } from '../entities/Score'
import { gameState$ } from './gameState'
import { finalizeWithValue } from '../util'

export function spawnEnemies(two: Two, player: Player, score: Score) {
  return timer(0, 300).pipe(map(() => spawnEnemy(two, player, score)))
}

function spawnEnemy(two: Two, player: Player, score: Score) {
  of(new Enemy(two, player.getPosition()))
    .pipe(
      combineLatestWith(deltaTime$),
      withLatestFrom(gameState$),
      takeWhile(
        ([[enemy], gameState]) => enemy.isInBounds() && ['play', 'end'].includes(gameState)
      ),
      finalizeWithValue(([[enemy]]) => enemy.destroyPawn())
    )
    .subscribe(([[enemy, deltaTime], gameState]) => {
      if (gameState === 'play') {
        enemy.update(deltaTime)
      }
      if (player.isCollidingWithEnemy(enemy) && gameState !== 'end') {
        gameState$.next('end')
      }
      if (!enemy.isInBounds()) {
        score.increment()
        score.update()
      }
    })
}
