import { lines, sum } from '@/advent'

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
    const after = por.filter(([b, a]) => b === n).map(([_, a]) => a)
    const before = por.filter(([b, a]) => a === n).map(([b]) => b)

    const elementsAfter = p.slice(i + 1).every(e => after.includes(e))
    const elementsBefore = p.slice(0, i).every(e => before.includes(e))

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

    throw new Error(`x: ${a}, ${b}`)
  }

function correctlyOrder(por: [number, number][], p: number[]): number[] {
  return p.sort(ordering(por))
}

export function partOne(input: Input) {
  const [por, pp] = input
  return sum(
    pp
      .filter(p => correctlyOrdered(por, p))
      .map(p => p[Math.floor(p.length / 2)]!)
  )
}

export function partTwo(input: Input) {
  const [por, pp] = input
  return sum(
    pp
      .filter(p => !correctlyOrdered(por, p))
      .map(p => correctlyOrder(por, p))
      .map(p => {
        console.log(p)
        return p[Math.floor(p.length / 2)]!
      })
  )
}
