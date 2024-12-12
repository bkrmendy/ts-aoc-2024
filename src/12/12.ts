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

function chunkByContigious(ns: number[]): number[][] {
  const [head, ...rest] = ns
  if (head == null) {
    return []
  }
  let chunks: number[][] = [[head]]
  for (const n of rest) {
    if (chunks.at(-1)!.at(-1)! + 1 === n) {
      chunks.at(-1)!.push(n)
    } else {
      chunks.push([n])
    }
  }
  return chunks
}

function edge(
  perimeters: Position[],
  direction: M2D.Facing,
  included: (_: Position) => boolean,
  sideToCheck: (_: Position) => number,
  sideToGroup: (_: Position) => number
): number {
  let ps = pipe(
    perimeters,
    Array.map(p => M2D.step(p, direction)),
    Array.filter(p => !included(p))
  )

  let gs: Map<number, number[]> = new Map()
  for (const p of ps) {
    if (!gs.has(sideToGroup(p))) {
      gs.set(sideToGroup(p), [])
    }
    gs.get(sideToGroup(p))!.push(sideToCheck(p))
  }

  // console.log(gs)

  return sum([...gs.values().map(ps => chunkByContigious(ps.sort()).length)])
}

function perimeterWBulkDiscount(region: Region, input: Input): number {
  const included = ({ r, c }: Position) => input[r]?.[c] === region.letter

  const perimeters = region.squares.filter(p =>
    neighborsViaEdge(p).some(p => !included(p))
  )

  const column = ({ c }: Position) => c
  const row = ({ r }: Position) => r

  return (
    edge(perimeters, M2D.UP, included, column, row) +
    edge(perimeters, M2D.DOWN, included, column, row) +
    edge(perimeters, M2D.LEFT, included, row, column) +
    edge(perimeters, M2D.RIGHT, included, row, column)
  )
}

export function partTwo(input: Input) {
  const regions = findRegions(input)
  const prices = regions.map(r => area(r) * perimeterWBulkDiscount(r, input))
  return sum(prices)
}
