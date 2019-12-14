import alienImageSource from './alien.png'
import shooterImageSource from './shooter.png'
import mothershipImageSource from './mothership.png'
import {
  alienHeight,
  alienWidth,
  bulletColour,
  bulletHeight,
  bulletWidth,
  finalScreenFont,
  finalScreenText,
  finalScreenTextColour,
  mothershipHeight,
  mothershipWidth,
  shooterHeight,
  shooterWidth
} from './settings'

const alienImage = new Image()
alienImage.src = alienImageSource

const shooterImage = new Image()
shooterImage.src = shooterImageSource

const mothershipImage = new Image()
mothershipImage.src = mothershipImageSource

function performDomUpdates (state) {
  document.getElementById('score').innerText = state.score
  document.getElementById('lives').innerText = state.lives
  document.getElementById('round').innerText = state.round
  document.getElementById('start').hidden = state.started
  document.getElementById('reset').hidden = !state.started
}

export default function drawState (state) {
  const canvas = document.getElementById('gameCanvas')
  const context = canvas.getContext('2d')

  // Clear old drawings
  context.clearRect(0, 0, canvas.width, canvas.height)

  performDomUpdates(state)

  if (state.isDead) {
    context.fillStyle = finalScreenTextColour
    context.font = finalScreenFont
    context.fillText(finalScreenText, 10, 50)
    context.fillText(`Score: ${state.score}`, 10, 110)
    context.fillText(`Round: ${state.round}`, 10, 160)

    return
  }

  // Draw shooter
  context.beginPath()
  context.drawImage(shooterImage, state.shooter.x, state.shooter.y, shooterWidth, shooterHeight)

  context.save()
  context.restore()

  state.aliens.objects.map(({x, y}) => {
    context.drawImage(alienImage, x, y, alienWidth, alienHeight)
  })

  context.save()
  context.restore()

  state.motherships.map(({x, y}) => {
    context.drawImage(mothershipImage, x, y, mothershipWidth, mothershipHeight)
  })

  context.save()
  context.restore()

  state.bullets.map(({x, y}) => {
    context.rect(x, y, bulletWidth, bulletHeight)
    context.fillStyle = bulletColour
    context.fill()
    context.closePath()
  })

  context.save()
  context.restore()
}
