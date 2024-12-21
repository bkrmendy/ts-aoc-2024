import { assertNever, lines, memo, minimum, sum } from '@/advent'
import { Array, pipe } from 'effect'
import { DOWN, Facing, LEFT, Position, RIGHT, step, toKey, UP } from '@/move2d'
import { PriorityQueue } from '@/priority-queue'

export function parse(input: string) {
  return lines(input)
}

type Input = ReturnType<typeof parse>

const NUMERIC_PAD = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['X', '0', 'A']
]

const DIRECTIONAL_PAD = [
  ['X', '^', 'A'],
  ['<', 'v', '>']
]

const MOVES: [Facing, string][] = [
  [LEFT, '<'],
  [RIGHT, '>'],
  [DOWN, 'v'],
  [UP, '^']
]

type PadType = 'd' | 'n'

type Path = string

const getPad = (padType: PadType) =>
  padType === 'd'
    ? DIRECTIONAL_PAD
    : padType === 'n'
      ? NUMERIC_PAD
      : assertNever(padType)

const getPosition = memo(
  (p, k) => p + k,
  (padType: PadType, key: string): Position =>
    getPad(padType)
      .flatMap((row, irow) =>
        row.flatMap((cell, icol): Position[] =>
          cell === key ? [{ r: irow, c: icol }] : []
        )
      )
      .at(0)!
)

const getShortestPaths = memo(
  (f, t, p) => `${toKey(f)}-${toKey(t)}-${p}`,
  (from: Position, to: Position, padType: PadType): Path[] => {
    const pad = getPad(padType)

    let q: [Position, string[]][] = [[from, []]]
    let seen: Set<string> = new Set()
    let result: Path[] = []

    while (q.length > 0) {
      const [next, path] = q.shift()!
      if (toKey(next) === toKey(to)) {
        result.push([...path, 'A'].join(''))
        continue
      }

      for (const [d, k] of MOVES) {
        let target = step(next, d)
        if (
          pad[target.r]?.[target.c] != null &&
          pad[target.r]![target.c]! !== 'X' &&
          !seen.has(toKey(target))
        ) {
          q.push([target, [...path, k]])
        }
      }
      seen.add(toKey(next))
    }

    return result
  }
)

function expand(current: string, code: string[], pad: PadType): string[] {
  const [head, ...rest] = code
  if (head == null) {
    return ['']
  }

  return expand(head, rest, pad).flatMap(postfix =>
    getShortestPaths(
      getPosition(pad, current),
      getPosition(pad, head),
      pad
    ).map(path => path + postfix)
  )
}

const getSequence = memo(
  (code, level) => `${code}-${level}`,
  (code: string, level: number): number => {
    if (level == 0) {
      return code.length
    }

    let result = 0
    let currentPos = getPosition('d', 'A')
    for (const k of code) {
      const keyPos = getPosition('d', k)
      result += pipe(
        getShortestPaths(currentPos, keyPos, 'd'),
        Array.map(path => getSequence(path, level - 1)),
        minimum
      )

      currentPos = keyPos
    }
    return result
  }
)

const complexity = (depth: number) => (code: string) => {
  const n = [...code.matchAll(/\d+/g)].map(Number).at(0)!
  return (
    n *
    pipe(
      expand('A', code.split(''), 'n'),
      Array.map(d => getSequence(d, depth)),
      minimum
    )
  )
}

const solve = (depth: number) => (input: Input) =>
  pipe(input, Array.map(complexity(depth)), sum)

export const partOne = solve(2)
export const partTwo = solve(25)
