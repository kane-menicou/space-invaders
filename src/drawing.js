import alienImageSource from './alien.png'

const alienImage = new Image()
alienImage.src = alienImageSource

export default function drawState (state) {
  const canvas = document.getElementById('gameCanvas')

  // Clear old drawings
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

  const shooter = canvas.getContext('2d')

  // Draw shooter
  shooter.beginPath()
  shooter.rect(state.shooter.x, state.shooter.y, 20, 50)
  shooter.fillStyle = '#0095DD'
  shooter.fill()
  shooter.closePath()

  state.aliens.objects.map(({x, y}) => {
    const alien = canvas.getContext('2d')

    alien.drawImage(alienImage, x, y, 25, 25)
  })

  state.bullets.map(({x, y}) => {
    const bullet = canvas.getContext('2d')
    bullet.rect(x, y, 5, 15)
    bullet.fillStyle = '#0095DD'
    bullet.fill()
    bullet.closePath()
  })

  document.getElementById('score').innerText = state.score
}
