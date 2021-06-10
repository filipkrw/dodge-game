import * as Two from 'twojs-ts'
import Player from './entities/Player'
import { Score } from './entities/Score'
import { Title } from './entities/Title'
import { deltaTime$ } from './widgets/deltaTime'
import { gameStateSwitch } from './widgets/gameState'
import { spawnEnemies } from './widgets/enemies'
import { onStart, playerMovement, startGame } from './widgets/userInput'
import { Interface } from './widgets/userInterface'
import { playerUpdate } from './widgets/player'

const root = document.getElementById('root')
const two = new Two({ fullscreen: true }).appendTo(root)

const player = new Player(two)
const score = new Score(two)
const title = new Title(two, 0, 48)
const subtitle = new Title(two, 56, 32)

const UI = Interface(score, title, subtitle)

gameStateSwitch({
  onStart: [onStart(player), UI.onStart$],
  onPlay: [
    playerMovement(player),
    spawnEnemies(two, player, score),
    playerUpdate(player),
    UI.onPlay$,
  ],
  onEnd: [startGame(player), UI.onEnd$],
}).subscribe()

deltaTime$.subscribe(() => {
  two.update()
})
