import { lines, sum } from '../advent'
import { DOWN, Facing, LEFT, Position, RIGHT, step, UP } from '@/move2d'

export function parse(input: string): {
  map: string[][]
  dirs: Facing[]
  start: Position
} {
  const [rawMap, rawDirs] = input.split('\n\n')
  const map = lines(rawMap!).map(l => [...l])
  const start: Position = map
    .flatMap((row, irow) =>
      row.flatMap((cell, icol) => (cell !== '@' ? [] : { r: irow, c: icol }))
    )
    .at(0)!

  map[start.r]![start.c] = '.'
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

  return { map, start, dirs }
}

type Input = ReturnType<typeof parse>

function tryPushBoxAt(
  position: Position,
  map: string[][],
  toward: Facing
): string[][] | null {
  const dest = step(position, toward)
  if (map[dest.r]![dest.c]! === '#') {
    return null
  }
  if (map[dest.r]![dest.c]! === '.') {
    map[dest.r]![dest.c]! = 'O'
    map[position.r]![position.c]! = '.'
    return map
  }

  if (map[dest.r]![dest.c]! === 'O') {
    const pushed = tryPushBoxAt(dest, map, toward)
    if (pushed == null) {
      return null
    }
    map[dest.r]![dest.c]! = 'O'
    map[position.r]![position.c]! = '.'
    return map
  }

  throw new Error(`Invalid tile: ${map[dest.r]![dest.c]!}`)
}

function tryMove(
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
    const pushed = tryPushBoxAt(dest, map, facing)
    if (pushed != null) {
      return { map: pushed, position: dest }
    }
    return { map, position }
  }

  throw new Error(`Invalid tile: ${map[dest.r]![dest.c]!}`)
}

function result(map: string[][]) {
  return sum(
    map.flatMap((row, irow) =>
      row.flatMap((cell, icol) => (cell !== 'O' ? 0 : 100 * irow + icol))
    )
  )
}

export function partOne(input: Input) {
  let { dirs, start: position } = input
  let map = [...input.map].map(m => [...m])
  for (const d of dirs) {
    const result = tryMove(position, map, d)
    map = result.map
    position = result.position
  }

  return result(map)
}

export function partTwo(input: Input) {}
