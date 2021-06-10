import * as Two from 'twojs-ts'
import Player from './entities/Player'
import { Score } from './entities/Score'
import { Title } from './entities/Title'
import { deltaTime$ } from './observables/deltaTime'
import { gameStateSwitch } from './observables/gameState'
import { spawnEnemies } from './observables/enemies'
import { onStart, playerMovement, startGame } from './observables/userInput'
import { Interface } from './observables/userInterface'
import { playerUpdate } from './observables/player'
import { fromEvent } from 'rxjs'
import { tap } from 'rxjs/operators'

const root = document.getElementById('root')
const two = new Two({ fullscreen: true }).appendTo(root)
const uiLayer = new Two.Group()
const gameLayer = new Two.Group()
//  @ts-ignore
two.add(gameLayer, uiLayer)

const player = new Player(two, gameLayer)
const score = new Score(two, uiLayer)
const title = new Title(two, 0, 48, uiLayer)
const subtitle = new Title(two, 56, 32, uiLayer)

const UI = Interface(score, title, subtitle)

fromEvent(window, 'resize').subscribe(() => {
  title.center()
  subtitle.center()
})

const centerPlayerPawn$ = fromEvent(window, 'resize').pipe(tap(() => player.reset()))

gameStateSwitch({
  onStart: [onStart(player), UI.onStart$, centerPlayerPawn$],
  onPlay: [
    playerMovement(player),
    spawnEnemies(two, player, score, gameLayer),
    playerUpdate(player),
    UI.onPlay$,
  ],
  onEnd: [startGame(player), UI.onEnd$],
}).subscribe()

deltaTime$.subscribe(() => {
  two.update()
})
