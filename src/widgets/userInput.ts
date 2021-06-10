import { EMPTY, fromEvent, of } from 'rxjs'
import { filter, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators'
import * as Two from 'twojs-ts'
import Player from '../entities/Player'
import { GameState, gameState$ } from './gameState'

export const playerMovement = (player: Player) => {
  return fromEvent(document, 'click').pipe(
    mergeMap((event) => {
      return of(event).pipe(
        tap((event: MouseEvent) => {
          const newGoal = new Two.Vector(event.clientX, event.clientY)
          player.setGoal(newGoal)
        })
      )
    })
  )
}

export const onStart = (player: Player) => {
  return playerMovement(player).pipe(tap(() => gameState$.next('play')))
}

export const startGame = (player: Player) => {
  return fromEvent(document, 'keydown').pipe(
    filter((event: KeyboardEvent) => event.key === ' '),
    tap(() => {
      gameState$.next('start')
      player.reset()
    })
  )
}
