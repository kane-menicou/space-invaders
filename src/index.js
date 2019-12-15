import calculateTickState from './calculateTickState'
import { onKeyDown, onKeyUp } from './keyHandlers'
import './style.sass'
import getFunctionToDrawState from './drawing'
import randomNumber from './statistic'
import { frameEveryMs } from './settings'
import getInitial from './state'

(() => {
  const canvas = document.getElementById('gameCanvas')
  let gameState = getInitial(canvas)

  getFunctionToDrawState(gameState)()

  let intervalHandleNumber

  const startButton = document.getElementById('start')
  const resetButton = document.getElementById('reset')

  const onKeyUpUpdate = ({key}) => {
    gameState = onKeyUp(key, gameState)

    getFunctionToDrawState(gameState)()
  }

  const onKeyDownUpdate = ({key}) => {
    gameState = onKeyDown(key, gameState)

    getFunctionToDrawState(gameState)()
  }

  resetButton.onclick = () => {
    document.removeEventListener('keyup', onKeyUpUpdate)
    document.removeEventListener('keydown', onKeyDownUpdate)
    clearInterval(intervalHandleNumber)

    gameState = getInitial(canvas)
    getFunctionToDrawState(gameState)()
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

        getFunctionToDrawState(gameState)()
      },
      frameEveryMs
    )

    document.addEventListener('keyup', onKeyUpUpdate)
    document.addEventListener('keydown', onKeyDownUpdate)
  }
})()

