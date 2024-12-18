import { lines, range } from '@/advent'
import { getBounds, neighborsViaEdge, Position, toKey } from '@/move2d'

export function parse(input: string) {
  return lines(input).map(
    l => [...l.matchAll(/\d+/g)].map(Number) as [number, number]
  )
}

type Input = ReturnType<typeof parse>

const EXIT: Position = { r: 70, c: 70 }
const BYTES: number = 1024

function walk(grid: string[][]): number | null {
  let bounds = getBounds(grid)
  let q: [Position, number][] = [[{ r: 0, c: 0 }, 0]]
  let seen: Set<string> = new Set([toKey({ r: 0, c: 0 })])
  while (q.length > 0) {
    let [pos, score] = q.shift()!
    if (pos.r === EXIT.r && pos.c === EXIT.c) {
      return score
    }
    for (const n of neighborsViaEdge(pos, bounds)) {
      if (!seen.has(toKey(n)) && grid[n.r]![n.c] !== '#') {
        q.push([n, score + 1])
      }
      seen.add(toKey(n))
    }
  }
  return null
}

function getGrid(
  size: { rows: number; columns: number },
  input: Input,
  count: number
): string[][] {
  let grid = [...range(0, size.rows + 1)].map(() =>
    [...range(0, size.columns + 1)].map(() => '.')
  )
  input.slice(0, count).forEach(([c, r]) => {
    grid[r]![c]! = '#'
  })
  return grid
}

export function partOne(input: Input) {
  return walk(getGrid({ rows: 70, columns: 70 }, input, BYTES))!
}

export function partTwo(input: Input) {
  for (const [i, _] of input.entries()) {
    const res = walk(getGrid({ rows: 70, columns: 70 }, input, i))
    if (res == null) {
      return input.at(i - 1)!
    }
  }
}
