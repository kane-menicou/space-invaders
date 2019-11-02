const aliensPerRow = 15
const alienXSpace = 25
const alienYSpace = 25
const yStart = 25

export default function getAliens (forRound = 1) {
  return [...new Array(forRound * aliensPerRow)].map((_, index) => {

    // Add a one here to ensure that 0 is not divided out.
    const currentRow = Math.ceil((index + 1) / aliensPerRow) - 1
    const y = currentRow * alienYSpace + yStart
    const x = (index * alienXSpace) - (currentRow * (aliensPerRow * alienXSpace))

    return {x, y}
  })
}
