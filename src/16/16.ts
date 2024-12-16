import { lines, minimum, sum } from '@/advent'
import {
  Facing,
  Position,
  RIGHT,
  step,
  toKey,
  turnLeft,
  turnRight
} from '@/move2d'

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
  let seen: Set<string> = new Set([toKey(start)])

  let scores: number[] = []

  while (q.length > 0) {
    let next = q.shift()

    if (input[next!.position.r]![next!.position.c]! === 'E') {
      scores.push(next!.score)
      continue
    }

    const ccw = turnLeft(next!.facing)
    const ccwAndAhead = step(next!.position, ccw)
    if (
      input[ccwAndAhead.r]![ccwAndAhead.c] !== '#' &&
      !seen.has(toKey(ccwAndAhead))
    ) {
      seen.add(toKey(ccwAndAhead))
      q.push({
        position: ccwAndAhead,
        facing: ccw,
        score: next!.score + 1001
      })
    }

    const cw = turnRight(next!.facing)
    const cwAndAhead = step(next!.position, cw)
    if (
      input[cwAndAhead.r]![cwAndAhead.c] !== '#' &&
      !seen.has(toKey(cwAndAhead))
    ) {
      seen.add(toKey(cwAndAhead))
      q.push({
        position: cwAndAhead,
        facing: cw,
        score: next!.score + 1001
      })
    }

    let ahead = step(next!.position, next!.facing)
    if (input[ahead.r]![ahead.c]! !== '#' && !seen.has(toKey(ahead))) {
      seen.add(toKey(ahead))
      q.push({ position: ahead, facing: next!.facing, score: next!.score + 1 })
    }
    q.sort((a, b) => a.score - b.score) // poor man's min heap
  }
  return minimum(scores)
}

export function partOne(input: Input) {
  const [start] = getStart(input)
  return getBestPathScore(start, input)
}

function reachEndIn(
  position: Position,
  facing: Facing,
  seen: Record<string, boolean>,
  score: number,
  maxScore: number,
  input: Input
): Record<string, boolean> | null {
  if (score > maxScore) {
    return null
  }

  if (input[position.r]![position.c]! === 'E' && score === maxScore) {
    return seen
  }

  const ccw = turnLeft(facing)
  const ccwAndAhead = step(position, ccw)
  const cw = turnRight(facing)
  const cwAndAhead = step(position, cw)
  let ahead = step(position, facing)

  let newSeen = { ...seen }

  if (
    input[ccwAndAhead.r]![ccwAndAhead.c] !== '#' &&
    seen[toKey(ccwAndAhead)] == null
  ) {
    const res = reachEndIn(
      ccwAndAhead,
      ccw,
      { ...seen, [toKey(ccwAndAhead)]: true },
      score + 1001,
      maxScore,
      input
    )
    if (res != null) {
      newSeen = { ...newSeen, ...res }
    }
  }

  if (
    input[cwAndAhead.r]![cwAndAhead.c] !== '#' &&
    seen[toKey(cwAndAhead)] == null
  ) {
    const res = reachEndIn(
      cwAndAhead,
      cw,
      { ...seen, [toKey(cwAndAhead)]: true },
      score + 1001,
      maxScore,
      input
    )
    if (res != null) {
      newSeen = { ...newSeen, ...res }
    }
  }

  if (input[ahead.r]![ahead.c] !== '#' && seen[toKey(ccwAndAhead)] == null) {
    const res = reachEndIn(
      ahead,
      facing,
      { ...seen, [toKey(ahead)]: true },
      score + 1001,
      maxScore,
      input
    )
    if (res != null) {
      newSeen = { ...newSeen, ...res }
    }
  }

  if (seen == newSeen) {
    return null
  }

  return newSeen
}

export function partTwo(input: Input) {
  // const [start] = getStart(input)
  // const bestPathScore = getBestPathScore(start, input)
  // const seats = reachEndIn(
  //   start,
  //   RIGHT,
  //   { [toKey(start)]: true },
  //   0,
  //   bestPathScore,
  //   input
  // )
  // return Object.keys(seats!).length
}
