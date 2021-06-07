import { Observable } from 'rxjs'
import { map, expand, share, pairwise } from 'rxjs/operators'
import * as Two from 'twojs-ts'
import { PlayState } from './state/PlayState'
import { BaseState } from './state/BaseState.interface'

const root = document.getElementById('root')
const two = new Two({ fullscreen: true }).appendTo(root)

const state: BaseState = new PlayState(two)

const framePaintTime$ = new Observable((subscriber) => {
  requestAnimationFrame((time) => {
    subscriber.next(time)
  })
})

framePaintTime$
  .pipe(
    expand(() => framePaintTime$),
    pairwise(),
    map(([previous, current]: [number, number]) => (current - previous) / 1000),
    share()
  )
  .subscribe((deltaTime) => {
    state.update(deltaTime)
    two.update()
  })
