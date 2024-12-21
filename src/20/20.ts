import { lines } from '@/advent'
import { getBounds, neighborsViaEdge, Position, toKey } from '@/move2d'

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
): Position[] {
  let bounds = getBounds(grid)
  let current = start
  let seen: Set<string> = new Set()
  let path: Position[] = []

  while (toKey(current) !== toKey(end)) {
    path.push(current)
    seen.add(toKey(current))
    current = neighborsViaEdge(current, bounds).find(
      n => grid[n.r]![n.c] !== '#' && !seen.has(toKey(n))
    )!
  }
  return path
}

const moveCheat =
  (steps: number) =>
  (grid: string[][], from: Position): Position[] => {
    let result: Position[] = []

    const bounds = getBounds(grid)
    let q: [Position, number][] = [[from, 0]]
    let seen: Set<string> = new Set([toKey(from)])

    while (q.length > 0) {
      let [p, s] = q.shift()!
      if (s > steps) {
        continue
      }

      if (grid[p.r]![p.c]! !== '#') {
        result.push(p)
      }

      for (const n of neighborsViaEdge(p, bounds)) {
        if (!seen.has(toKey(n))) {
          seen.add(toKey(n))
          q.push([n, s + 1])
        }
      }
    }

    return result
  }

function cheats(
  grid: string[][],
  path: Position[],
  cheat: (grid: string[][], from: Position) => Position[]
) {
  let result: number[] = []
  let times: Record<string, number> = {}
  path.forEach((p, t) => (times[toKey(p)] = t))

  for (let p of path) {
    for (const move of cheat(grid, p)) {
      const from = times[toKey(p)]!
      const to = times[toKey(move)]!
      const shortcut = Math.abs(p.r - move.r) + Math.abs(p.c - move.c)
      if (from < to) {
        result.push(to - from - shortcut)
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
