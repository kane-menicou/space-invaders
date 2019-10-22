import getAliens from './getAliens'

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

function updateAlienAndScore ({canvas, shooter, round, ...state}) {
  const {isTravelingLeft, objects} = state.aliens

  const alienObjects = cloneObject(objects)

  const someHaveReachedRight = alienObjects.some(({x}) => x >= (canvas.width - 20))
  const someHaveReachedLeft = alienObjects.some(({x}) => x <= 0)

  const updatedIsTravelingLeft = (() => {
    if (isTravelingLeft && someHaveReachedLeft) {
      return false
    }

    if (!isTravelingLeft && someHaveReachedRight) {
      return true
    }

    return isTravelingLeft
  })()

  state.aliens.objects.forEach((alien, key) => {
    state.bullets.forEach((bullet) => {
      if (hasHit(alien, bullet)) {
        delete alienObjects[key]
      }
    })
  })

  state.aliens.objects.forEach((alien, key) => {
    if (hasHit(alien, shooter)) {
      delete alienObjects[key]
    }
  })

  const someHaveReachedBottom = state.aliens.objects.some(({y}) => y >= (canvas.height - 25))

  const countExponent = ((60 - alienObjects.length)) / 100
  const alienSpeed = Math.pow(6, countExponent)

  const movedAlienObjects = alienObjects.filter(ifUndefined).map(({y, x}) => ({
    y: (someHaveReachedRight || someHaveReachedLeft) && !someHaveReachedBottom ? y + 7 : y,
    x: isTravelingLeft ? x - alienSpeed : x + alienSpeed
  }))

  return {
    ...state.aliens,
    isTravelingLeft: updatedIsTravelingLeft,
    objects: objects.length <= 0 ? getAliens(round) : movedAlienObjects
  }
}

function updateScore (state) {
  let newScore = state.score

  state.aliens.objects.forEach(alien => {
    state.bullets.forEach(bullet => {
      if (hasHit(alien, bullet)) {
        newScore++
      }
    })
  })

  return newScore
}

function updateSpaceLocked ({pressedKeys}) {
  return pressedKeys.indexOf(' ') !== -1
}

function updateLives ({lives, shooter, aliens}) {
  return aliens.objects.some((alien) => hasHit(alien, shooter)) ? lives - 1 : lives
}

function updateRound ({round, aliens}) {
  return aliens.objects.length <= 0 ? round + 1 : round
}

export default function calculateTickState (state) {
  const bullets = updateBullets(state)
  const shooter = updateShooter(state)
  const spaceLocked = updateSpaceLocked(state)
  const lives = updateLives(state)
  const aliens = updateAlienAndScore(state)
  const score = updateScore(state)
  const round = updateRound(state)

  return {
    ...state,
    shooter,
    lives,
    spaceLocked,
    bullets,
    aliens,
    round,
    score
  }
}
