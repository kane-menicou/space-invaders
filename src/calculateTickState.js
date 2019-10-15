function updateBullets (state) {
  const bullets = state.bullets

  if (state.pressedKeys.indexOf(' ') !== -1) {
    bullets.push(createBullet(state))
  }

  const bulletSpeed = 5

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
    x: state.shooter.x + (15 / 2),
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

function updatePressedKeys (state) {
  const {pressedKeys} = state

  return pressedKeys.filter(check => {
    return check !== " "
  })
}

function updateAlienAndScore (state) {
  const {canvas, score} = state
  const {isTravelingLeft, objects} = state.aliens

  const someHaveReachedRight = objects.some(({x}) => x === (canvas.width - 20))
  const someHaveReachedLeft = objects.some(({x}) => x === 0)

  const updatedIsTravelingLeft = (() => {
    if (isTravelingLeft && someHaveReachedLeft) {
      return false
    }

    if (!isTravelingLeft && someHaveReachedRight) {
      return true
    }

    return isTravelingLeft
  })()

  let newScore = score;
  state.aliens.objects.forEach((alien, key) => {
    state.bullets.forEach((bullet) => {
      const yInRange = (bullet.y - 25) < alien.y && (bullet.y + 25) > alien.y
      const xInRange = (bullet.x - 25) < alien.x && (bullet.x + 25) > alien.x

      if (xInRange && yInRange) {
        delete objects[key]
        newScore = newScore + 1
      }
    })
  })

  return {
    score: newScore,
    aliens: {
      ...state.aliens,
      isTravelingLeft: updatedIsTravelingLeft,
      objects: objects.map(({y, x}) => ({
        y: someHaveReachedRight || someHaveReachedLeft ? y + 15 : y,
        x: isTravelingLeft ? x - 1 : x + 1
      }))
    }
  }
}

export default function calculateTickState (state) {
  const bullets = updateBullets(state)
  const shooter = updateShooter(state)
  const pressedKeys = updatePressedKeys(state)
  const {aliens, score} = updateAlienAndScore(state)

  return {
    ...state,
    shooter,
    pressedKeys,
    bullets,
    aliens,
    score
  }
}
