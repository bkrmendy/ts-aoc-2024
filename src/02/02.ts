import { lines, words, zip } from '@/advent'

export function parse(input: string) {
  return lines(input).map(l => words(l).map(Number))
}

type Input = ReturnType<typeof parse>

function safe(seq: number[]): boolean {
  const diffs = [...zip(seq, seq.slice(1))].map(([a, b]) => a - b)
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
  let total = 0
  for (const line of input) {
    for (const variant of variants(line)) {
      if (safe(variant)) {
        total += 1
        break
      }
    }
  }
  return total
}
