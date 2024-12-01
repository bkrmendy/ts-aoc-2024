import { lines, sum, words, zip } from '@/advent'

export function parse(input: string): [number[], number[]] {
  const rows = lines(input).map(l => words(l).map(Number))
  return [rows.map(r => r.at(0)!).sort(), rows.map(r => r.at(1)!).sort()]
}

type Input = ReturnType<typeof parse>

export function partOne(input: Input) {
  const [f, s] = input
  return sum([...zip(f, s)].map(([a, b]) => Math.abs(a - b)))
}

export function partTwo(input: Input) {
  const [f, s] = input
  const sCounts = s.reduce((acc: Record<string, number>, val) => {
    acc[val] = (acc[val] ?? 0) + 1
    return acc
  }, {})
  return sum(f.map(n => n * (sCounts[n] ?? 0)))
}
