import {
  animationFrameScheduler,
  EMPTY,
  fromEvent,
  iif,
  Observable,
  of,
  BehaviorSubject,
  timer,
} from 'rxjs'
import {
  map,
  expand,
  share,
  pairwise,
  observeOn,
  combineLatestWith,
  filter,
  takeWhile,
  tap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators'
import * as Two from 'twojs-ts'
import Player from './Player'
import Enemy from './Enemy'
import { finalizeWithValue } from './util'
import { Score } from './Score'
import { Title } from './Title'

const root = document.getElementById('root')
const two = new Two({ fullscreen: true }).appendTo(root)
const player = new Player(two)
const score = new Score(two)
const title = new Title(two, 0, 48)
const subtitle = new Title(two, 56, 32)

type GameState = 'start' | 'play' | 'end'

const gameState$ = new BehaviorSubject<GameState>('start')

const framePaintTime$ = new Observable((subscriber) => {
  requestAnimationFrame((time) => {
    subscriber.next(time)
  })
})

const deltaTime$ = framePaintTime$.pipe(
  observeOn(animationFrameScheduler),
  expand(() => framePaintTime$),
  pairwise(),
  map(([previous, current]: [number, number]) => (current - previous) / 1000),
  share()
)

const enemies$ = timer(0, 300).pipe(
  map(() =>
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
  )
)

gameState$.pipe(switchMap((state) => iif(() => state === 'play', enemies$, EMPTY))).subscribe()

gameState$
  .pipe(
    switchMap((gameState) => {
      console.log(gameState)
      if (gameState === 'play') {
        score.scoreText.visible = true
      } else if (gameState === 'start') {
        score.score = 0
      } else {
        score.scoreText.visible = false
      }
      score.update()
      return EMPTY
    })
  )
  .subscribe()

gameState$
  .pipe(
    switchMap((gameState) => {
      if (gameState === 'start') {
        title.text.visible = true
        title.text.value = 'Click anywhere to start'

        subtitle.text.visible = true
        subtitle.text.value = 'Try to avoid azure balls.'
      } else if (gameState === 'play') {
        title.text.visible = false
        subtitle.text.visible = false
      } else if (gameState === 'end') {
        title.text.visible = true
        title.text.value = `Game over!`

        subtitle.text.visible = true
        subtitle.text.value = `You manged to outlive ${score.score} menacing azure balls.`
      }
      return EMPTY
    })
  )
  .subscribe()

fromEvent(document, 'keydown')
  .pipe(
    withLatestFrom(gameState$),
    filter(
      ([event, gameState]: [event: KeyboardEvent, gameState: GameState]) =>
        event.key === ' ' && gameState === 'end'
    ),
    tap(() => {
      gameState$.next('start')
      const middleOfScreen = new Two.Vector(two.width / 2, two.height / 2)
      player.pawn.translation = middleOfScreen
      player.goal = null
    })
  )
  .subscribe()

fromEvent(document, 'click')
  .pipe(
    filter((event: MouseEvent) => {
      return event.button === 0
    }),
    withLatestFrom(gameState$),
    switchMap(([event, gameState]) => {
      if (gameState === 'play') {
        return of(event).pipe(
          tap((event: MouseEvent) => {
            const newGoal = new Two.Vector(event.clientX, event.clientY)
            player.setGoal(newGoal)
          })
        )
      } else if (gameState === 'start') {
        gameState$.next('play')
        return of(event).pipe(
          tap((event: MouseEvent) => {
            const newGoal = new Two.Vector(event.clientX, event.clientY)
            player.setGoal(newGoal)
          })
        )
      } else {
        return EMPTY
      }
    })
  )
  .subscribe()

deltaTime$.pipe(withLatestFrom(gameState$)).subscribe(([deltaTime, gameState]) => {
  if (gameState === 'play') {
    player.update(deltaTime)
  }
  two.update()
})
