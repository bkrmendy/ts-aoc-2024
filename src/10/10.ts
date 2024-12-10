import { lines, sum } from '@/advent'
import { getBounds, neighborsViaEdge, Position, toKey } from '@/move2d'
import { pipe, Array } from 'effect'

export function parse(input: string) {
  return lines(input).map(l => [...l].map(Number))
}

type Input = ReturnType<typeof parse>

const heads = (input: Input) =>
  input.flatMap((row, ir) =>
    row.flatMap((cell, ic): Position[] =>
      cell === 0 ? [{ r: ir, c: ic }] : []
    )
  )

function score(from: Position, input: Input, count: (_: number) => number) {
  const bounds = getBounds(input)
  let queue: Array<[Position, number]> = [[from, 0]]
  let counts: Map<string, number> = new Map()

  while (queue.length > 0) {
    let [pos, currentHeight] = queue.shift()!
    let neighbors = neighborsViaEdge(pos, bounds)
    for (const n of neighbors) {
      const neigborHeight = input[n.r]![n.c]!
      const delta = neigborHeight - currentHeight
      if (delta === 1 && neigborHeight === 9) {
        counts.set(toKey(n), count(counts.get(toKey(n)) ?? 0))
      } else if (delta === 1) {
        queue.push([n, neigborHeight])
      }
    }
  }

  return sum([...counts.values()])
}

const solve = (count: (_: number) => number) => (input: Input) =>
  pipe(
    input,
    heads,
    Array.map(f => score(f, input, count)),
    sum
  )

export const partOne = solve(() => 1)
export const partTwo = solve(c => c + 1)
