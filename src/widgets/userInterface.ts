import { BehaviorSubject, EMPTY, of } from 'rxjs'
import { switchMap, mergeWith, withLatestFrom, tap } from 'rxjs/operators'
import { Score } from '../entities/Score'
import { GameState, gameState$ } from './gameState'
import { Title } from '../entities/Title'

export const Interface = (score: Score, title: Title, subtitle: Title) => {
  const interface$ = of(score).pipe(
    withLatestFrom(of(title), of(subtitle)),
    tap(([score]) => score.update())
  )

  return {
    onStart$: interface$.pipe(
      tap(([score, title, subtitle]) => {
        score.score = 0
        score.scoreText.visible = false
        score.update()

        title.text.visible = true
        title.text.value = 'Click anywhere to start'

        subtitle.text.visible = true
        subtitle.text.value = 'Try to avoid azure balls.'
      })
    ),
    onPlay$: interface$.pipe(
      tap(([score, title, subtitle]) => {
        score.scoreText.visible = true

        title.text.visible = false
        subtitle.text.visible = false
      })
    ),
    onEnd$: interface$.pipe(
      tap(([score, title, subtitle]) => {
        score.scoreText.visible = false

        title.text.visible = true
        title.text.value = `Game over!`

        subtitle.text.visible = true
        subtitle.text.value = `You manged to outlive ${score.score} menacing azure balls.`
      })
    ),
  }
}
