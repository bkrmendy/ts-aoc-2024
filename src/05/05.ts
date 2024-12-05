import { lines, sum } from '@/advent'
import { Array, pipe } from 'effect'

interface Ordering {
  [n: number]: { before: number[]; after: number[] }
}

export function parse(input: string): [Ordering, number[][]] {
  const [por, pp] = input.split('\n\n')
  let ordering: Ordering = {}
  lines(por!).forEach(l => {
    const [before, after] = l.split('|').map(Number)
    if (ordering[before!] == null) {
      ordering[before!] = { before: [], after: [] }
    }
    ordering[before!]!.after.push(after!)

    if (ordering[after!] == null) {
      ordering[after!] = { before: [], after: [] }
    }
    ordering[after!]!.before.push(before!)
  })

  const ppParsed = lines(pp!).map(l => l.split(',').map(Number))
  return [ordering, ppParsed]
}

type Input = ReturnType<typeof parse>

function correctlyOrdered(ordering: Ordering, p: number[]): boolean {
  return p.every((n, i) => {
    const { before, after } = ordering[n]!

    const elementsAfter = p.slice(i + 1).every(_ => after.includes(_))
    const elementsBefore = p.slice(0, i).every(_ => before.includes(_))

    return elementsAfter && elementsBefore
  })
}

const BEFORE = -1
const EQ = 0
const AFTER = 1

const ordering =
  (ordering: Ordering) =>
  (a: number, b: number): number => {
    if (a === b) {
      return EQ
    }

    if (ordering[a]?.after.includes(b) || ordering[b]?.before.includes(a)) {
      return BEFORE
    }

    if (ordering[a]?.before.includes(b) || ordering[b]?.after.includes(a)) {
      return AFTER
    }

    throw new Error(`ordering not found: ${a}, ${b}`)
  }

export function partOne([ordering, pp]: Input) {
  return pipe(
    pp,
    Array.filter(p => correctlyOrdered(ordering, p)),
    Array.map(p => p[Math.floor(p.length / 2)]!),
    sum
  )
}

export function partTwo([o, pp]: Input) {
  return pipe(
    pp,
    Array.filter(p => !correctlyOrdered(o, p)),
    Array.map(p => p.sort(ordering(o))),
    Array.map(p => p[Math.floor(p.length / 2)]!),
    sum
  )
}
