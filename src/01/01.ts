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
  return sum(f.map(n => n * s.filter(nn => nn === n).length))
}
