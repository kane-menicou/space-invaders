import calculateTickState from './calculateTickState'
import { onKeyDown, onKeyUp } from './keyHandlers'
import './style.sass'
import drawState from './drawing'
import getAliens from './getAliens'
import randomNumber from './statistic'

function getInitialGameState (canvas) {
  return {
    score: 0,
    lives: 3,
    round: 1,
    isDead: false,
    shooter: {
      x: canvas.width / 2,
      y: canvas.height - 30,
    },
    motherships: [],
    started: false,
    pressedKeys: [],
    canvas: {
      width: canvas.width,
      height: canvas.height,
    },
    spaceLocked: false,
    bullets: [],
    aliens: {
      isTravelingLeft: false,
      objects: getAliens()
    }
  }
}

(() => {
  const canvas = document.getElementById('gameCanvas')
  let gameState = getInitialGameState(canvas)

  drawState(gameState)

  let intervalHandleNumber

  const startButton = document.getElementById('start')
  const resetButton = document.getElementById('reset')

  const onKeyUpUpdate = ({key}) => {
    gameState = onKeyUp(key, gameState)

    drawState(gameState)
  }

  const onKeyDownUpdate = ({key}) => {
    gameState = onKeyDown(key, gameState)

    drawState(gameState)
  }

  resetButton.onclick = () => {
    document.removeEventListener('keyup', onKeyUpUpdate)
    document.removeEventListener('keydown', onKeyDownUpdate)
    clearInterval(intervalHandleNumber)

    gameState = getInitialGameState(canvas)
    drawState(gameState)
  }

  startButton.onclick = () => {
    if (gameState.started) {
      return
    }

    gameState.started = true

    intervalHandleNumber = setInterval(
      () => {
        const shouldAddNewMothership = randomNumber(100) === 0

        gameState = calculateTickState(gameState, shouldAddNewMothership)

        drawState(gameState)
      },
      20
    )

    document.addEventListener('keyup', onKeyUpUpdate)
    document.addEventListener('keydown', onKeyDownUpdate)
  }
})()

