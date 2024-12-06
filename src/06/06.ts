import { lines } from '@/advent'

interface Position {
  r: number
  c: number
}

interface Facing {
  h: number
  v: number
}

const turn = ({ v, h }: Facing): Facing => ({
  v: h,
  h: -v
})

const step = (position: Position, facing: Facing): Position => ({
  r: position.r + facing.v,
  c: position.c + facing.h
})

export function parse(input: string) {
  return lines(input).map(l => [...l])
}

type Input = ReturnType<typeof parse>

const toKey = ({ r, c }: Position): string => `${r}-${c}`
const fromKey = (key: string): Position => {
  const [r, c] = key.split('-')
  return { r: parseInt(r!), c: parseInt(c!) }
}

function route(
  input: Input,
  start: Position
): { positions: Position[]; looped: boolean } {
  let position = start
  let facing: Facing = { h: 0, v: -1 }
  let places: Record<string, number> = { [`${position.r}-${position.c}`]: 1 }
  let running = true
  let looped = false
  while (running) {
    const ahead = step(position, facing)
    if (input[ahead.r]?.[ahead.c] == null) {
      running = false
    } else if (places[toKey(ahead)] != null && places[toKey(ahead)]! > 3) {
      looped = true
      running = false
    } else if (input[ahead.r]?.[ahead.c] === '#') {
      facing = turn(facing)
    } else {
      places[toKey(ahead)] = (places[toKey(ahead)] ?? 0) + 1
      position = ahead
    }
  }
  return { positions: [...Object.keys(places)].map(fromKey), looped: looped }
}

function findStart(input: Input): Position {
  const startRow = input.findIndex(row => row.includes('^'))
  const startCol = input[startRow]!.findIndex(c => c === '^')
  return { r: startRow, c: startCol }
}

export function partOne(input: Input) {
  const { positions } = route(input, findStart(input))
  return positions.length
}

export function partTwo(input: Input) {
  const start = findStart(input)
  const { positions } = route(input, start)
  let os: Set<string> = new Set()
  for (const position of positions) {
    const o = input[position.r]![position.c]!
    input[position.r]![position.c]! = '#'
    const { looped } = route(input, start)
    if (looped) {
      os.add(toKey(position))
    }
    input[position.r]![position.c]! = o
  }
  return os.size
}
