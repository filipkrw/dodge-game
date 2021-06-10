import { tap } from 'rxjs/operators'
import Player from '../entities/Player'
import { deltaTime$ } from './deltaTime'

export const playerUpdate = (player: Player) =>
  deltaTime$.pipe(tap((deltaTime) => player.update(deltaTime)))
