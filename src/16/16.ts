import { lines, union } from '@/advent'
import {
  Facing,
  Position,
  RIGHT,
  step,
  toKey,
  turnLeft,
  turnRight
} from '@/move2d'
import { PriorityQueue } from '@/priority-queue'

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

const toKeyPF = (pos: Position, face: Facing): string =>
  JSON.stringify({ pos, face })

const fromKeyPF = (key: string): { pos: Position; face: Facing } =>
  JSON.parse(key)

function getBestPathScore(
  [start, end]: [Position, Position],
  input: string[][]
): [Step, Record<string, [Position, Facing][]>] {
  let q: PriorityQueue<Step> = new PriorityQueue()
  q.enqueue({ position: start, facing: RIGHT, score: 0 }, 0)

  // https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Pseudocode
  let distances: Record<string, number> = { [toKeyPF(start, RIGHT)]: 0 }
  let prev: Record<string, [Position, Facing][]> = {}

  while (q.size() > 0) {
    let current = q.dequeue()!

    if (toKey(current.position) === toKey(end)) {
      return [current, prev]
    }

    const ccw = turnLeft(current.facing)
    const ccwAndAhead: Step = {
      position: step(current.position, ccw),
      facing: ccw,
      score: current.score + 1001
    }
    const cw = turnRight(current.facing)
    const cwAndAhead: Step = {
      position: step(current.position, cw),
      facing: cw,
      score: current.score + 1001
    }
    const ahead: Step = {
      position: step(current.position, current.facing),
      facing: current.facing,
      score: current.score + 1
    }

    for (const step of [ccwAndAhead, cwAndAhead, ahead]) {
      const { position, facing, score } = step
      if (input[position.r]![position.c] === '#') {
        continue
      }

      const best = distances[toKeyPF(position, facing)] ?? Infinity
      if (score > best) {
        continue
      }

      if (score < best) {
        q.enqueue(step, score)
        distances[toKeyPF(position, facing)] = score
        prev[toKeyPF(position, facing)] = []
      }

      prev[toKeyPF(position, facing)]!.push([current.position, current.facing])
    }
  }

  throw new Error('Could not reach end node')
}

export function partOne(input: Input) {
  return getBestPathScore(getStart(input), input)[0].score
}

export function partTwo(input: Input) {
  const [start, end] = getStart(input)
  const [final, prev] = getBestPathScore([start, end], input)

  let seats: Set<string> = new Set([toKeyPF(final.position, final.facing)])

  while (!seats.has(toKeyPF(start, RIGHT))) {
    let current: Set<string> = new Set()
    for (const n of seats.values().map(e => fromKeyPF(e))) {
      current = union(
        current,
        new Set(prev[toKeyPF(n.pos, n.face)]!.map(p => toKeyPF(p[0], p[1])))
      )
    }
    seats = union(seats, current)
  }
  return new Set(seats.values().map(v => toKey(fromKeyPF(v).pos))).size
}
