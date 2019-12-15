import { getAliens, getBlock } from './getObjects'

export default function getInitial (canvas) {
  return {
    score: 0,
    lives: 3,
    round: 1,
    isDead: false,
    shooter: {
      x: canvas.width / 2,
      y: canvas.height - 30,
    },
    motherships: [],
    started: false,
    pressedKeys: [],
    canvas: {
      width: canvas.width,
      height: canvas.height,
    },
    blocks: [
      getBlock(50, canvas.height - 100, 50, 50),
      getBlock(300, canvas.height - 100, 100, 50)
    ],
    spaceLocked: false,
    bullets: [],
    aliens: {
      isTravelingLeft: false,
      objects: getAliens()
    }
  }
}
