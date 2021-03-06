import { getAliens } from './getObjects'
import {
  alienHeight,
  alienKillPoints,
  alienWidth,
  alienYMovement,
  bulletSpeed,
  canvasBottomAlienOffset,
  mothershipKillPoints,
  mothershipSpeed, mothershipTopOffset,
  rightCanvasOffset,
  shooterSpeed,
  shooterXOffset,
  shooterYOffset
} from './settings'

function cloneObject (src) {
  return JSON.parse(JSON.stringify(src))
}

function updateIsDead ({lives}) {
  return lives <= 0
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

  return bullets
    .filter(ifUndefined)
    .map(({y, ...bullet}) => ({...bullet, y: y - bulletSpeed}))
    .filter(({y}) => y > 0)
}

function updateShooter (state) {
  const newState = {...state}

  if (state.pressedKeys.indexOf('A') !== -1) {
    newState.shooter = moveShooterX(newState, shooterSpeed)
  }

  if (state.pressedKeys.indexOf('D') !== -1) {
    newState.shooter = moveShooterX(newState, -shooterSpeed)
  }

  return newState.shooter
}

function createBullet (state) {
  return {
    x: state.shooter.x + shooterXOffset,
    y: state.shooter.y + shooterYOffset,
  }
}

function moveShooterX (state, by) {
  const x = state.shooter.x - by

  if (x <= 0 || x >= (state.canvas.width - rightCanvasOffset)) {
    return state.shooter
  }

  return {
    ...state.shooter,
    x
  }
}

function hasHit (obj1, obj2) {
  const yInRange = (obj2.y - alienHeight) < obj1.y && (obj2.y + alienHeight) > obj1.y
  const xInRange = (obj2.x - alienWidth) < obj1.x && (obj2.x + alienWidth) > obj1.x

  return xInRange && yInRange
}

function ifUndefined (val) {
  return val !== undefined
}

function updateAlienAndScore ({canvas, shooter, round, ...state}) {
  const {isTravelingLeft, objects} = state.aliens

  const alienObjects = cloneObject(objects)

  const someHaveReachedRight = alienObjects.some(({x}) => x >= (canvas.width - rightCanvasOffset))
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

  const someHaveReachedBottom = state.aliens.objects.some(({y}) => y >= (canvas.height - canvasBottomAlienOffset))

  const countExponent = ((100 - alienObjects.length)) / 100
  const alienSpeed = Math.pow(6, countExponent) * (round / 10)

  const movedAlienObjects = alienObjects.filter(ifUndefined).map(({y, x}) => ({
    y: ((someHaveReachedRight || someHaveReachedLeft) && !someHaveReachedBottom) ? y + alienYMovement : y,
    x: isTravelingLeft ? x - alienSpeed : x + alienSpeed
  }))

  return {
    ...state.aliens,
    isTravelingLeft: updatedIsTravelingLeft,
    objects: objects.length <= 0 ? getAliens(round) : movedAlienObjects
  }
}

function updateScore ({score, aliens, bullets, motherships}) {
  const killedAliens = aliens.objects.filter(alien => bullets.some(bullet => hasHit(alien, bullet)))
  const killedMotherships = motherships.filter(mothership => bullets.some(bullet => hasHit(mothership, bullet)))

  return (killedAliens.length * alienKillPoints) + (killedMotherships.length * mothershipKillPoints) + score
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

function updateMotherships ({motherships, canvas, bullets}, newMothership) {
  if (newMothership) {
    motherships.push({x: 0, y: mothershipTopOffset})
  }

  return motherships
    .map(({x, ...rest}) => ({x: x + mothershipSpeed, ...rest}))
    .filter((mothership) => mothership.x < canvas.width && !bullets.some(bullet => hasHit(bullet, mothership)))
}

export default function calculateTickState (state, newMothership) {
  const stateClone = cloneObject(state)

  const bullets = updateBullets(stateClone)
  const shooter = updateShooter(stateClone)
  const spaceLocked = updateSpaceLocked(stateClone)
  const lives = updateLives(stateClone)
  const aliens = updateAlienAndScore(stateClone)
  const score = updateScore(stateClone)
  const round = updateRound(stateClone)
  const isDead = updateIsDead(stateClone)
  const motherships = updateMotherships(stateClone, newMothership)

  return {
    ...state,
    shooter,
    lives,
    started: !isDead,
    spaceLocked,
    bullets,
    isDead,
    aliens,
    round,
    score,
    motherships
  }
}
