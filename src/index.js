import calculateTickState from './calculateTickState'
import { onKeyDown, onKeyUp } from './keyHandlers'
import './style.sass'
import drawState from './drawing'

function getInitialGameState (canvas) {
  return {
    score: 0,
    lives: 3,
    shooter: {
      x: canvas.width / 2,
      y: canvas.height - 30,
    },
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
      objects: [
        {x: 30, y: 1},
        {x: 50, y: 1},
        {x: 70, y: 1},
        {x: 90, y: 1},
        {x: 110, y: 1},
        {x: 130, y: 1},
        {x: 150, y: 1},
        {x: 170, y: 1},
        {x: 190, y: 1},
        {x: 210, y: 1},
        {x: 230, y: 1},
        {x: 250, y: 1},
        {x: 270, y: 1},
        {x: 290, y: 1},
        {x: 310, y: 1},
        {x: 330, y: 1},
        {x: 350, y: 1},
        {x: 370, y: 1},
        {x: 390, y: 1},
        {x: 410, y: 1},

        {x: 30, y: 20},
        {x: 50, y: 20},
        {x: 70, y: 20},
        {x: 90, y: 20},
        {x: 110, y: 20},
        {x: 130, y: 20},
        {x: 150, y: 20},
        {x: 170, y: 20},
        {x: 190, y: 20},
        {x: 210, y: 20},
        {x: 230, y: 20},
        {x: 250, y: 20},
        {x: 270, y: 20},
        {x: 290, y: 20},
        {x: 310, y: 20},
        {x: 330, y: 20},
        {x: 350, y: 20},
        {x: 370, y: 20},
        {x: 390, y: 20},
        {x: 410, y: 20},

        {x: 30, y: 40},
        {x: 50, y: 40},
        {x: 70, y: 40},
        {x: 90, y: 40},
        {x: 110, y: 40},
        {x: 130, y: 40},
        {x: 150, y: 40},
        {x: 170, y: 40},
        {x: 190, y: 40},
        {x: 210, y: 40},
        {x: 230, y: 40},
        {x: 250, y: 40},
        {x: 270, y: 40},
        {x: 290, y: 40},
        {x: 310, y: 40},
        {x: 330, y: 40},
        {x: 350, y: 40},
        {x: 370, y: 40},
        {x: 390, y: 40},
        {x: 410, y: 40},
      ]
    }
  }
}

(() => {
  const canvas = document.getElementById('gameCanvas')
  let gameState = getInitialGameState(canvas)

  let intervalHandleNumber;

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

    gameState.started = true;

    drawState(gameState)

    intervalHandleNumber = setInterval(
      () => {
        gameState = calculateTickState(gameState)

        drawState(gameState)
      },
      20
    )

    document.addEventListener('keyup', onKeyUpUpdate)
    document.addEventListener('keydown', onKeyDownUpdate)
  }
})()

