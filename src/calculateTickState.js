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
      if (hasHit(alien, bullet)) {
        delete bullets[key]
      }
    })
  })

  const bulletSpeed = 7

  return bullets.filter(ifUndefined).map(({y, ...bullet}) => ({...bullet, y: y - bulletSpeed})).filter(({y}) => y > 0)
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

function hasHit (obj1, obj2) {
  const yInRange = (obj2.y - 15) < obj1.y && (obj2.y + 15) > obj1.y
  const xInRange = (obj2.x - 15) < obj1.x && (obj2.x + 15) > obj1.x

  return xInRange && yInRange
}

function ifUndefined (val) {
  return val !== undefined
}

function updateAlienAndScore (state) {
  const {canvas, score, shooter} = state
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
      if (hasHit(alien, bullet)) {
        delete objects[key]
        newScore = newScore + 1
      }
    })
  })

  state.aliens.objects.forEach((alien, key) => {
    if (hasHit(alien, shooter)) {
      delete objects[key]
    }
  })

  const someHaveReachedBottom = state.aliens.objects.some(({y}) =>  y >= (state.canvas.height - 25))

  const countExponent = ((60 - objects.length)) / 100
  const alienSpeed = Math.pow(6, countExponent)

  return {
    score: newScore,
    aliens: {
      ...state.aliens,
      isTravelingLeft: updatedIsTravelingLeft,
      objects: objects.filter(ifUndefined).map(({y, x}) => ({
        y: (someHaveReachedRight || someHaveReachedLeft) && !someHaveReachedBottom ? y + 7 : y,
        x: isTravelingLeft ? x - alienSpeed : x + alienSpeed
      }))
    }
  }
}

function updateSpaceLocked ({pressedKeys}) {
  return pressedKeys.indexOf(' ') !== -1
}

function updateLives ({lives, shooter, aliens}) {
  return aliens.objects.some((alien) => hasHit(alien, shooter)) ? lives - 1 : lives
}

export default function calculateTickState (state) {
  const bullets = updateBullets(state)
  const shooter = updateShooter(state)
  const spaceLocked = updateSpaceLocked(state)
  const lives = updateLives(state)
  const {aliens, score} = updateAlienAndScore(state)

  return {
    ...state,
    shooter,
    lives,
    spaceLocked,
    bullets,
    aliens,
    score
  }
}
