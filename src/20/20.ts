import { lines } from '@/advent'
import {
  DOWN,
  fromKey,
  getBounds,
  LEFT,
  neighborsViaEdge,
  Position,
  RIGHT,
  step,
  toKey,
  UP
} from '@/move2d'
import { pipe, Array } from 'effect'

export function parse(input: string) {
  return lines(input).map(l => [...l])
}

function getStart(input: string[][]): [Position, Position] {
  let start: Position | null = null
  let end: Position | null = null
  for (const [irow, row] of input.entries()) {
    for (const [icol, cell] of row.entries()) {
      if (cell === 'S') {
        start = { r: irow, c: icol }
      }
      if (cell === 'E') {
        end = { r: irow, c: icol }
      }
    }
  }

  return [start!, end!]
}

type Input = ReturnType<typeof parse>

function walk(
  grid: string[][],
  [start, end]: [Position, Position]
): [Position, number][] | null {
  let bounds = getBounds(grid)
  let q: [Position, number][] = [[start, 0]]
  let seen: Set<string> = new Set([toKey(start)])
  let path: [Position, number][] = []
  while (true) {
    let [pos, time] = q.shift()!
    path.push([pos, time])
    if (pos.r === end.r && pos.c === end.c) {
      return path
    }
    for (const n of neighborsViaEdge(pos, bounds)) {
      if (!seen.has(toKey(n)) && grid[n.r]![n.c] !== '#') {
        q.push([n, time + 1])
      }
      seen.add(toKey(n))
    }
  }
}

const moveCheat =
  (steps: number) =>
  (grid: string[][], from: Position): Position[] => {
    let result: Position[] = []

    const deltas = [UP, DOWN, LEFT, RIGHT]
    let q = deltas.map(d => step(from, d)).filter(p => grid[p.r]?.[p.c] === '#').map(p => [p, steps - 1])
    for (const d of deltas) {
      const next = step(from, d)
      if (grid[next.r]?.[next.c] === '#') {
        const nn = step(next, d)
        if (grid[nn.r]?.[nn.c] !== '#') {
          result.push(nn)
        }
      }
    }
    return result
  }

function cheats(
  grid: string[][],
  path: [Position, number][],
  cheat: (grid: string[][], from: Position) => Position[]
) {
  let result: number[] = []
  for (let [i, [p, t]] of path.entries()) {
    const moves = new Set(cheat(grid, p).map(toKey))
    for (let [p2, t2] of path.slice(i + 1)) {
      if (moves.has(toKey(p2))) {
        result.push(t2 - t - 2)
      }
    }
  }
  return result
}

const solve = (steps: number) => (input: Input) => {
  const [start, end] = getStart(input)
  const path = walk(input, [start, end])!
  const chs = cheats(input, path, moveCheat(steps))

  return chs.filter(c => c >= 100).length
}

export const partOne = solve(2)
export const partTwo = solve(20)
