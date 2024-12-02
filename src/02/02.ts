import { lines, words, zip } from '@/advent'

interface Diff {
  next: number
  skip: number | null
}

export function parse(input: string) {
  return lines(input).map(l => words(l).map(Number))
}

function diffs(values: number[]): Diff[] {
  const diffs: Diff[] = []
  for (const [i, v] of values.entries()) {
    const next = values.at(i + 1)
    if (next == null) {
      continue
    }
    const oneAfterNext = values.at(i + 2)
    diffs.push({
      next: v - next,
      skip: oneAfterNext == null ? null : v - oneAfterNext
    })
  }
  return diffs
}

type Input = ReturnType<typeof parse>

const DELTAS = {
  up: [1, 2, 3],
  down: [-1, -2, -3]
}

function check(diffs: Diff[], canSkip: boolean, dir: 'up' | 'down'): boolean {
  const [delta, ...rest] = diffs

  if (delta == null) {
    // we reached the end
    return true
  }

  const deltas = DELTAS[dir]

  if (deltas.includes(delta.next)) {
    return check(rest, canSkip, dir)
  }

  if (canSkip && delta.skip != null && deltas.includes(delta.skip)) {
    return check(rest.slice(1), false, dir)
  }

  if (canSkip && delta.skip == null) {
    return true
  }

  return false
}

export function partOne(input: Input) {
  return input.filter(nums => {
    const deltas = diffs(nums)
    return check(deltas, false, 'up') || check(deltas, false, 'down')
  }).length
}

export function partTwo(input: Input) {
  return input.filter(nums => {
    const deltas = diffs(nums)
    return check(deltas, true, 'up') || check(deltas, true, 'down')
  }).length
}
