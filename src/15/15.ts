import { lines, sum } from '../advent'
import { DOWN, Facing, LEFT, Position, RIGHT, step, UP } from '@/move2d'

export function parse(input: string): { map: string[][]; dirs: Facing[] } {
  const [rawMap, rawDirs] = input.split('\n\n')
  const map = lines(rawMap!).map(l => [...l])
  const dirs = lines(rawDirs!)
    .flatMap(l => [...l])
    .map(d => {
      switch (d) {
        case '^':
          return UP
        case '>':
          return RIGHT
        case '<':
          return LEFT
        case 'v':
          return DOWN
        default:
          throw new Error(`Invalid dir: ${d}`)
      }
    })

  return { map, dirs }
}

function findStart(map: string[][]): {
  map: string[][]
  start: Position
} {
  let start: Position = { r: 0, c: 0 }
  map.forEach((row, irow) =>
    row.forEach((cell, icol) => {
      if (cell === '@') {
        start = { r: irow, c: icol }
      }
    })
  )

  map[start.r]![start.c] = '.'

  return { map, start }
}

function zoom(map: string[][]): string[][] {
  return map.map(row =>
    row.flatMap(cell => {
      switch (cell) {
        case '#':
          return ['#', '#']
        case 'O':
          return ['[', ']']
        case '.':
          return ['.', '.']
        case '@':
          return ['@', '.']
        default:
          throw new Error(`Invalid tile: ${cell}`)
      }
    })
  )
}

type Input = ReturnType<typeof parse>

function tryPushBoxAt1(
  position: Position,
  map: string[][],
  toward: Facing
): string[][] | null {
  const dest = step(position, toward)
  if (map[dest.r]![dest.c]! === '#') {
    return null
  }
  if (map[dest.r]![dest.c]! === '.') {
    map[dest.r]![dest.c]! = map[position.r]![position.c]!
    map[position.r]![position.c]! = '.'
    return map
  }

  if (map[dest.r]![dest.c]! === 'O') {
    const pushed = tryPushBoxAt1(dest, map, toward)
    if (pushed == null) {
      return null
    }
    pushed[dest.r]![dest.c]! = map[position.r]![position.c]!
    pushed[position.r]![position.c]! = '.'
    return pushed
  }

  throw new Error(`Invalid tile: ${map[dest.r]![dest.c]!}`)
}

function tryPushBoxAt2(
  boxAt: Position,
  map: string[][],
  toward: Facing,
  isOtherHalf: boolean
): string[][] | null {
  const otherHalfPushed = isOtherHalf
    ? map
    : tryPushBoxAt2(
        getBoxHalf(map, boxAt),
        [...map].map(l => [...l]),
        toward,
        true
      )
  if (otherHalfPushed == null) {
    return null
  }
  const dest = step(boxAt, toward)
  if (map[dest.r]![dest.c]! === '#') {
    return null
  }
  if (otherHalfPushed[dest.r]![dest.c]! === '.') {
    otherHalfPushed[dest.r]![dest.c]! = otherHalfPushed[boxAt.r]![boxAt.c]!
    otherHalfPushed[boxAt.r]![boxAt.c]! = '.'
    return otherHalfPushed
  }

  if (
    otherHalfPushed[dest.r]![dest.c]! === '[' ||
    otherHalfPushed[dest.r]![dest.c]! === ']'
  ) {
    const pushed = tryPushBoxAt2(dest, otherHalfPushed, toward, false)
    if (pushed == null) {
      return null
    }
    pushed[dest.r]![dest.c]! = otherHalfPushed[boxAt.r]![boxAt.c]!
    pushed[boxAt.r]![boxAt.c]! = '.'
    return pushed
  }

  throw new Error(`Invalid tile: ${map[dest.r]![dest.c]!}`)
}

function tryMove1(
  position: Position,
  map: string[][],
  facing: Facing
): { map: string[][]; position: Position } {
  const dest = step(position, facing)
  if (map[dest.r]![dest.c]! === '#') {
    // can't move into wall
    return { map, position }
  }

  if (map[dest.r]![dest.c]! === '.') {
    // can move on free space
    return { map, position: dest }
  }

  if (map[dest.r]![dest.c]! === 'O') {
    const pushed = tryPushBoxAt1(dest, map, facing)
    if (pushed != null) {
      return { map: pushed, position: dest }
    }
    return { map, position }
  }

  throw new Error(`Invalid tile: ${map[dest.r]![dest.c]!}`)
}

function getBoxHalf(map: string[][], pos: Position): Position {
  if (map[pos.r]![pos.c]! === '[') {
    return { r: pos.r, c: pos.c + 1 }
  }

  if (map[pos.r]![pos.c]! === ']') {
    return { r: pos.r, c: pos.c - 1 }
  }

  throw new Error(`Invalid box half: ${map[pos.r]![pos.c]!}`)
}

function tryMove2(
  position: Position,
  map: string[][],
  facing: Facing
): { map: string[][]; position: Position } {
  const dest = step(position, facing)
  if (map[dest.r]![dest.c]! === '#') {
    return { map, position }
  }

  if (map[dest.r]![dest.c]! === '.') {
    return { map, position: dest }
  }

  if (map[dest.r]![dest.c]! === '[' || map[dest.r]![dest.c]! === ']') {
    const pushed = tryPushBoxAt2(dest, map, facing, false)
    if (pushed != null) {
      return { map: pushed, position: dest }
    }
    return { map, position }
  }

  throw new Error(`Invalid tile: ${map[dest.r]![dest.c]!}`)
}

function result(map: string[][], box: string) {
  return sum(
    map.flatMap((row, irow) =>
      row.flatMap((cell, icol) => (cell !== box ? 0 : 100 * irow + icol))
    )
  )
}

export function partOne(input: Input) {
  let { map, start: position } = findStart([...input.map].map(m => [...m]))
  for (const d of input.dirs) {
    const result = tryMove1(position, map, d)
    map = result.map
    position = result.position
  }

  return result(map, 'O')
}

function draw(map: string[][], position: Position) {
  const mm = [...map].map(l => [...l])
  mm[position.r]![position.c] = '@'
  console.log(mm.map(l => l.join('')).join('\n'))
}

export function partTwo(input: Input) {
  let map = zoom(input.map)
  let start = findStart(map)
  map = start.map
  let position = start.start
  for (const d of input.dirs) {
    const result = tryMove2(position, map, d)
    map = result.map
    position = result.position
  }
  return result(map, '[')
}
