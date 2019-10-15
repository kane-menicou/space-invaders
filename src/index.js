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
        { x: 30, y: 1},
        { x: 50, y: 1},
        { x: 70, y: 1},
        { x: 90, y: 1},
        { x: 110, y: 1},
        { x: 130, y: 1},
        { x: 150, y: 1},
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

