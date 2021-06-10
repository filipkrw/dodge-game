import { BehaviorSubject, EMPTY, Observable } from 'rxjs'
import { mergeWith, switchMap } from 'rxjs/operators'

export type GameState = 'start' | 'play' | 'end'
export const gameState$ = new BehaviorSubject<GameState>('start')

export function gameStateSwitch({
  onStart = [EMPTY],
  onPlay = [EMPTY],
  onEnd = [EMPTY],
}: {
  onStart?: any[]
  onPlay?: any[]
  onEnd?: any[]
}) {
  return gameState$.pipe(
    switchMap((gameState) => {
      if (gameState === 'start') return mergeFromArray(onStart)
      else if (gameState === 'play') return mergeFromArray(onPlay)
      else if (gameState === 'end') return mergeFromArray(onEnd)
      else EMPTY
    })
  )
}

function mergeFromArray(observables: any[]) {
  if (observables.length < 2) {
    return observables
  } else {
    return observables[0].pipe(mergeWith(...observables.filter((_, i) => i > 0)))
  }
}
