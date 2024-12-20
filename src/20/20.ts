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
): [Position, number][] {
  let bounds = getBounds(grid)
  let time = 0
  let current = start
  let seen: Set<string> = new Set()
  let path: [Position, number][] = []

  while (toKey(current) !== toKey(end)) {
    path.push([current, time])
    seen.add(toKey(current))
    time += 1
    current = neighborsViaEdge(current, bounds).find(
      n => grid[n.r]![n.c] !== '#' && !seen.has(toKey(n))
    )!
  }
  return path
}

const moveCheat =
  (steps: number) =>
  (grid: string[][], from: Position): [Position, number][] => {
    let result: [Position, number][] = []

    const bounds = getBounds(grid)
    let q: [Position, number][] = [[from, 0]]
    let seen: Set<string> = new Set([toKey(from)])

    while (q.length > 0) {
      let [p, s] = q.shift()!
      if (s > steps) {
        continue
      }

      if (grid[p.r]![p.c]! !== '#') {
        result.push([p, s])
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
  path: [Position, number][],
  cheat: (grid: string[][], from: Position) => [Position, number][]
) {
  let result: Record<string, number> = {}
  let times: Record<string, number> = {}
  path.forEach(([p, t]) => (times[toKey(p)] = t))

  for (let [p] of path) {
    for (const [move, shortcut] of cheat(grid, p)) {
      const from = times[toKey(p)]!
      const to = times[toKey(move)]!
      if (from < to) {
        result[`${toKey(p)}~${toKey(move)}`] = to - from - shortcut
      }
    }
  }
  return result
}

const solve = (steps: number) => (input: Input) => {
  const [start, end] = getStart(input)
  const path = walk(input, [start, end])!
  const chs = cheats(input, path, moveCheat(steps))

  return Object.values(chs).filter(c => c >= 100).length
}

export const partOne = solve(2)
export const partTwo = solve(20)
