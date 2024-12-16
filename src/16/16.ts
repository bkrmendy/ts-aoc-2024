import { lines, minimum } from '@/advent'
import {
  Facing,
  Position,
  RIGHT,
  step,
  toKey,
  turnLeft,
  turnRight
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

interface Step {
  position: Position
  facing: Facing
  score: number
}

function getBestPathScore(start: Position, input: string[][]) {
  let q: Step[] = [{ position: start, facing: RIGHT, score: 0 }]
  let parent: Record<string, [Position, number][]> = {}

  while (q.length > 0) {
    let current = q.shift()!
    if (parent[toKey(current.position)] != null) {
      continue
    }

    parent[toKey(current.position)] = []

    const ccw = turnLeft(current.facing)
    const ccwAndAhead = step(current.position, ccw)
    if (input[ccwAndAhead.r]![ccwAndAhead.c] !== '#') {
      parent[toKey(current.position)]!.push([ccwAndAhead, current.score + 1001])
      q.push({
        position: ccwAndAhead,
        facing: ccw,
        score: current.score + 1001
      })
    }

    const cw = turnRight(current.facing)
    const cwAndAhead = step(current.position, cw)
    if (input[cwAndAhead.r]![cwAndAhead.c] !== '#') {
      parent[toKey(current.position)]!.push([cwAndAhead, current.score + 1001])
      q.push({
        position: cwAndAhead,
        facing: cw,
        score: current.score + 1001
      })
    }

    let ahead = step(current.position, current.facing)
    if (input[ahead.r]![ahead.c]! !== '#') {
      parent[toKey(current.position)]!.push([ahead, current.score + 1])
      q.push({
        position: ahead,
        facing: current.facing,
        score: current.score + 1
      })
    }
    q.sort((a, b) => a.score - b.score) // poor man's min heap
  }
  return parent
}

export function partOne(input: Input) {
  const [start, end] = getStart(input)
  const parent = getBestPathScore(start, input)
  return pipe(
    Object.values(parent),
    Array.flatMap(v => v),
    Array.filter(([p, _]) => p.c === end.c && p.r === end.r),
    Array.map(([_, s]) => s),
    minimum
  )
}

export function partTwo(input: Input) {
  const [start, end] = getStart(input)
  const parent = getBestPathScore(start, input)
  console.log(
    Object.values(parent)
      .flat()
      .filter(([p]) => p.c === end.c && p.r === end.r).length
  )
}
