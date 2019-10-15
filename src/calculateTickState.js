function cloneObject (src) {
  return JSON.parse(JSON.stringify(src))
}

function updateBullets (state) {
  const bullets = cloneObject(state.bullets)

  if (state.pressedKeys.indexOf(' ') !== -1 && !state.spaceLocked) {
    bullets.push(createBullet(state))
  }

  state.aliens.objects.forEach((alien) => {
    state.bullets.forEach((bullet, key) => {
      if (bulletHasHit(alien, bullet)) {
        delete bullets[key]
      }
    })
  })

  const bulletSpeed = 7

  return bullets.map(({y, ...bullet}) => ({...bullet, y: y - bulletSpeed})).filter(({y}) => y > 0)
}

function updateShooter (state) {
  const newState = {...state}

  if (state.pressedKeys.indexOf('A') !== -1) {
    newState.shooter = moveShooterX(newState, 3)
  }

  if (state.pressedKeys.indexOf('D') !== -1) {
    newState.shooter = moveShooterX(newState, -3)
  }

  return newState.shooter
}

function createBullet (state) {
  return {
    x: state.shooter.x + (25 / 2),
    y: state.shooter.y + 1,
  }
}

function moveShooterX (state, by) {
  const x = state.shooter.x - by

  if (x <= 0 || x >= (state.canvas.width - 20)) {
    return state.shooter
  }

  return {
    ...state.shooter,
    x
  }
}

function bulletHasHit (alien, bullet) {
  const yInRange = (bullet.y - 15) < alien.y && (bullet.y + 15) > alien.y
  const xInRange = (bullet.x - 15) < alien.x && (bullet.x + 15) > alien.x

  return xInRange && yInRange
}

function updateAlienAndScore (state) {
  const {canvas, score} = state
  const {isTravelingLeft, objects} = state.aliens

  const someHaveReachedRight = objects.some(({x}) => x >= (canvas.width - 20))
  const someHaveReachedLeft = objects.some(({x}) => x <= 0)

  const updatedIsTravelingLeft = (() => {
    if (isTravelingLeft && someHaveReachedLeft) {
      return false
    }

    if (!isTravelingLeft && someHaveReachedRight) {
      return true
    }

    return isTravelingLeft
  })()

  let newScore = score
  state.aliens.objects.forEach((alien, key) => {
    state.bullets.forEach((bullet) => {
      if (bulletHasHit(alien, bullet)) {
        delete objects[key]
        newScore = newScore + 1
      }
    })
  })

  const countExponent = ((60 - objects.length)) / 100
  const alienSpeed = Math.pow(6, countExponent)

  return {
    score: newScore,
    aliens: {
      ...state.aliens,
      isTravelingLeft: updatedIsTravelingLeft,
      objects: objects.filter(val => val !== undefined).map(({y, x}) => ({
        y: someHaveReachedRight || someHaveReachedLeft ? y + 7 : y,
        x: isTravelingLeft ? x - alienSpeed : x + alienSpeed
      }))
    }
  }
}

function updateSpaceLocked ({pressedKeys}) {
  return pressedKeys.indexOf(' ') !== -1
}

export default function calculateTickState (state) {
  const bullets = updateBullets(state)
  const shooter = updateShooter(state)
  const spaceLocked = updateSpaceLocked(state)
  const {aliens, score} = updateAlienAndScore(state)

  return {
    ...state,
    shooter,
    spaceLocked,
    bullets,
    aliens,
    score
  }
}
