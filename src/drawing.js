import alienImageSource from './alien.png'
import shooterImageSource from './shooter.png'
import mothershipImageSource from './mothership.png'

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
    context.fillStyle = '#ff0000'
    context.font = '50px VT323'
    context.fillText(`You're dead!`, 10, 50)
    context.fillText(`Score: ${state.score}`, 10, 110)
    context.fillText(`Round: ${state.round}`, 10, 160)

    return;
  }

  // Draw shooter
  context.beginPath()
  context.drawImage(shooterImage, state.shooter.x, state.shooter.y, 25, 25)

  context.save()
  context.restore()

  state.aliens.objects.map(({x, y}) => {
    context.drawImage(alienImage, x, y, 25, 25)
  })

  context.save()
  context.restore()

  state.motherships.map(({x, y}) => {
    context.drawImage(mothershipImage, x, y, 25, 25)
  })

  context.save()
  context.restore()

  state.bullets.map(({x, y}) => {
    context.rect(x, y, 2, 10)
    context.fillStyle = '#d8222c'
    context.fill()
    context.closePath()
  })

  context.save()
  context.restore()
}
