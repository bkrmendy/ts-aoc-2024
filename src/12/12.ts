import { lines, sum } from '@/advent'
import { pipe, Array, Order } from 'effect'
import * as M2D from '@/move2d'
import { Position } from '@/move2d'

export function parse(input: string) {
  return lines(input).map(l => [...l])
}

type Input = ReturnType<typeof parse>

interface Region {
  letter: string
  squares: Position[]
}

function findRegions(input: Input): Region[] {
  let bounds = M2D.getBounds(input)
  let seen: Set<string> = new Set()

  function getRegion(from: Position, letter: string): Region {
    let queue: Position[] = [from]
    let toCheck: Set<string> = new Set([M2D.toKey(from)])
    let squaresInRegion: Set<string> = new Set()

    while (queue.length > 0) {
      const next = queue.shift()!
      const neighbors = M2D.neighborsViaEdge(next, bounds).filter(
        ({ r, c }) =>
          !seen.has(M2D.toKey({ r, c })) &&
          !toCheck.has(M2D.toKey({ r, c })) &&
          input[r]![c] === letter
      )
      seen.add(M2D.toKey(next))
      squaresInRegion.add(M2D.toKey(next))
      for (const n of neighbors) {
        queue.push(n)
        toCheck.add(M2D.toKey(n))
      }
    }

    return { letter, squares: [...squaresInRegion].map(M2D.fromKey) }
  }

  let regions: Region[] = []
  for (const [irow, row] of input.entries()) {
    for (const [icol, cell] of row.entries()) {
      if (!seen.has(M2D.toKey({ r: irow, c: icol }))) {
        let region = getRegion({ r: irow, c: icol }, cell)
        regions.push(region)
      }
    }
  }

  return regions
}

function area(region: Region): number {
  return region.squares.length
}

function neighborsViaEdge(pos: Position): Position[] {
  return [
    { r: pos.r - 1, c: pos.c },
    { r: pos.r + 1, c: pos.c },
    { r: pos.r, c: pos.c - 1 },
    { r: pos.r, c: pos.c + 1 }
  ]
}

function perimeter(region: Region, input: Input): number {
  let total = 0
  for (const square of region.squares) {
    for (const neighbor of neighborsViaEdge(square)) {
      if (input[neighbor.r]?.[neighbor.c] !== region.letter) {
        total += 1
      }
    }
  }

  return total
}

export function partOne(input: Input) {
  const regions = findRegions(input)
  const prices = regions.map(r => area(r) * perimeter(r, input))
  return sum(prices)
}

const deltas = [-1, 1] as const

export const directions2D: [number, number][] = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
]

const countCorners = ({ c: x, r: y }: Position, input: Input): number =>
  [0, 1, 2, 3]
    .map((d): [[number, number], [number, number]] => [
      directions2D[d]!,
      directions2D[(d + 1) % 4]!
    ])
    .map(([[dx1, dy1], [dx2, dy2]]) => [
      input[y]![x]!,
      input[y + dy1]?.[x + dx1],
      input[y + dy2]?.[x + dx2],
      input[y + dy1 + dy2]?.[x + dx1 + dx2]
    ])
    .filter(
      ([plant, left, right, mid]) =>
        (left !== plant && right !== plant) ||
        (left === plant && right === plant && mid !== plant)
    ).length

export function partTwo(input: Input) {
  const regions = findRegions(input)
  const prices = regions.map(r => {
    const c = sum(r.squares.map(s => countCorners(s, input)))
    console.log(r.letter, c)
    return area(r) * c
  })
  return sum(prices)
}
