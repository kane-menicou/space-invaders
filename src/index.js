import calculateTickState from './calculateTickState'
import { onKeyDown, onKeyUp } from './keyHandlers'
import './style.sass'
import drawState from './drawing'

(() => {
  const canvas = document.getElementById('gameCanvas')

  let gameState = {
    score: 0,
    shooter: {
      x: canvas.width / 2,
      y: canvas.height - 30,
    },
    pressedKeys: [],
    canvas: {
      width: canvas.width,
      height: canvas.height,
    },
    bullets: [],
    aliens: {
      isTravelingLeft: false,
      objects: [
        { x: 1, y: 1},
        { x: 20, y: 1},
        { x: 40, y: 1},
        { x: 60, y: 1},
        { x: 80, y: 1},
        { x: 100, y: 1},
        { x: 120, y: 1},
        { x: 140, y: 1},
      ]
    }
  }

  drawState(gameState)

  setInterval(
    () => {
      gameState = calculateTickState(gameState)

      drawState(gameState)
    },
    20
  )

  document.addEventListener('keyup', ({key}) => {
    gameState = onKeyUp(key, gameState)

    drawState(gameState)
  })

  document.addEventListener('keydown', ({key}) => {
    gameState = onKeyDown(key, gameState)

    drawState(gameState)
  })
})()

