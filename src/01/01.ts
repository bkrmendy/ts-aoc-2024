import { lines } from '@/advent'
import { Array, pipe } from 'effect'

export const parse = (input: string) =>
  pipe(
    lines(input),
    Array.map(line => {
      const amount = parseInt(line.slice(1), 10)
      return line[0] === 'L' ? -amount : amount
    })
  )

type Input = ReturnType<typeof parse>

const solve =
  (fn: (current: number, rotation: number) => number) => (input: Input) => {
    let result = 0
    let current = 50
    for (const rotation of input) {
      result += fn(current, rotation)
      current += rotation
    }
    return result
  }

export const partOne = solve((current, rotation) =>
  (current + rotation) % 100 === 0 ? 1 : 0
)

export const partTwo = solve((current, rotation) => {
  let c = 0
  for (let i = 0; i < Math.abs(rotation); i++) {
    if ((current + i * Math.sign(rotation)) % 100 === 0) {
      c += 1
    }
  }
  return c
})
