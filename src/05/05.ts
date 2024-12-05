import { lines, sum } from '@/advent'
import { Array, pipe } from 'effect'

export function parse(input: string): [[number, number][], number[][]] {
  const [por, pp] = input.split('\n\n')
  const porParsed = lines(por!).map((l): [number, number] => {
    const [b, a] = l.split('|')
    return [Number(b!), Number(a!)]
  })
  const ppParsed = lines(pp!).map(l => l.split(',').map(Number))
  return [porParsed, ppParsed]
}

type Input = ReturnType<typeof parse>

function correctlyOrdered(por: [number, number][], p: number[]): boolean {
  return p.every((n, i) => {
    const after = por.filter(_ => _[0] === n).map(_ => _[1])
    const before = por.filter(_ => _[1] === n).map(_ => _[0])

    const elementsAfter = p.slice(i + 1).every(_ => after.includes(_))
    const elementsBefore = p.slice(0, i).every(_ => before.includes(_))

    return elementsAfter && elementsBefore
  })
}

const BEFORE = -1
const EQ = 0
const AFTER = 1

const ordering =
  (por: [number, number][]) =>
  (a: number, b: number): number => {
    if (a === b) {
      return EQ
    }

    if (por.some(([bef, aft]) => bef === a && aft === b)) {
      return BEFORE
    }

    if (por.some(([bef, aft]) => bef === b && aft === a)) {
      return AFTER
    }

    throw new Error(`ordering not found: ${a}, ${b}`)
  }

function correctlyOrder(por: [number, number][], p: number[]): number[] {
  return p.sort(ordering(por))
}

export function partOne([por, pp]: Input) {
  return pipe(
    pp,
    Array.filter(p => correctlyOrdered(por, p)),
    Array.map(p => p[Math.floor(p.length / 2)]!),
    sum
  )
}

export function partTwo([por, pp]: Input) {
  return pipe(
    pp,
    Array.filter(p => !correctlyOrdered(por, p)),
    Array.map(p => correctlyOrder(por, p)),
    Array.map(p => p[Math.floor(p.length / 2)]!),
    sum
  )
}
