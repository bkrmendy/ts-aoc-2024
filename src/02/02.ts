import { lines, words, zip } from '@/advent'

interface Diff {
  next: number // difference between this and the next number
  skip: number | null // difference between this and the number after the next. `null` if this the penultimate number
}

export function parse(input: string) {
  return lines(input).map(l => words(l).map(Number))
}

// finds out the diffs between the original values
function diffs(values: number[]): Diff[] {
  const diffs: Diff[] = []
  for (const [i, v] of values.entries()) {
    const next = values.at(i + 1)
    if (next == null) {
      // this is the last number, there's nothing to diff against
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
    // ok, move on to the next doff
    return check(rest, canSkip, dir)
  }

  if (canSkip && delta.skip == null) {
    // if this is the penultimate number (because skip == null)
    // and we got this far, ie so far so good
    // and we can skip:
    // drop the last number and call it a day
    return true
  }

  if (
    canSkip && // we can skip
    delta.skip != null && // there's something to skip to
    deltas.includes(delta.skip) // it's a valid delta
  ) {
    return check(
      rest.slice(1), // skipping a number, continuing from the one after the next
      false, // only a single skip is allowed (if it's allowed at all)
      dir
    )
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
