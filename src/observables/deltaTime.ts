import { animationFrameScheduler, Observable } from 'rxjs'
import { expand, map, observeOn, pairwise, share, withLatestFrom } from 'rxjs/operators'

const framePaintTime$ = new Observable((subscriber) => {
  requestAnimationFrame((time) => {
    subscriber.next(time)
  })
})

export const deltaTime$ = framePaintTime$.pipe(
  observeOn(animationFrameScheduler),
  expand(() => framePaintTime$),
  pairwise(),
  map(([previous, current]: [number, number]) => (current - previous) / 1000),
  share()
)
