import { lines, words } from '@/advent'
import { Array, pipe } from 'effect'

export function parse(input: string) {
  return lines(input).map(l => words(l).map(Number))
}

type Input = ReturnType<typeof parse>

function safe(seq: number[]): boolean {
  const diffs = pipe(
    Array.zip(seq, seq.slice(1)),
    Array.map(([a, b]) => a - b)
  )
  const safe =
    diffs.every(dd => 1 <= dd && dd < 4) ||
    diffs.every(dd => -3 <= dd && dd < 0)
  return safe
}

export function partOne(input: Input) {
  return input.filter(safe).length
}

function* variants(line: number[]): Iterable<number[]> {
  yield line

  for (let i = 0; i < line.length; i++) {
    yield [...line.slice(0, i), ...line.slice(i + 1)]
  }
}

export function partTwo(input: Input) {
  return input.filter(line => {
    for (const variant of variants(line)) {
      if (safe(variant)) {
        return true
      }
    }
  }).length
}
