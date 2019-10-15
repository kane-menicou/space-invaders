import alienImageSource from './alien.png'
import shooterImageSource from './shooter.png'

const alienImage = new Image()
alienImage.src = alienImageSource

const shooterImage = new Image()
shooterImage.src = shooterImageSource

export default function drawState (state) {
  const canvas = document.getElementById('gameCanvas')
  const context = canvas.getContext('2d')

  // Clear old drawings
  context.clearRect(0, 0, canvas.width, canvas.height)

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

  state.bullets.map(({x, y}) => {
    context.rect(x, y, 2, 10)
    context.fillStyle = '#d8222c'
    context.fill()
    context.closePath()
  })

  context.save()
  context.restore()

  document.getElementById('score').innerText = state.score
}
