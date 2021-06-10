import { defer, Observable } from 'rxjs'
import { finalize, tap } from 'rxjs/operators'

export function getRandomIntInRange(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

// https://github.com/ReactiveX/rxjs/issues/4803#issuecomment-496711335
export function finalizeWithValue<T>(callback: (value: T) => void) {
  return (source: Observable<T>) =>
    defer(() => {
      let lastValue: T
      return source.pipe(
        tap((value) => (lastValue = value)),
        finalize(() => callback(lastValue))
      )
    })
}
