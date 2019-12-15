import { aliensPerRow, alienXSpace, alienYSpace, blockHeight, blockWidth, canvasLeftAlienOffset } from './settings'

export function getAliens (forRound = 1) {
  return [...new Array(forRound * aliensPerRow)].map((_, index) => {

    // Add a one here to ensure that 0 is not divided out.
    const currentRow = Math.ceil((index + 1) / aliensPerRow) - 1
    const y = currentRow * alienYSpace + canvasLeftAlienOffset
    const x = (index * alienXSpace) - (currentRow * (aliensPerRow * alienXSpace))

    return {x, y}
  })
}

export function getBlock (x, y, width, height) {
  return flattenBlocksArray(
    [...new Array(width)].map((_, xLoop) => {
      return [...new Array(height)].map((_, yLoop) => {
        return {
          x: x + xLoop,
          y: y + yLoop
        }
      })
    })
  )
}

function flattenBlocksArray (array) {
  const flat = []

  array.forEach((item) => {
    if (Array.isArray(item)) {
      flattenBlocksArray(item).forEach((subItem) => {
        flat.push(subItem)
      })
    }

    flat.push(item)
  })

  return flat
}
