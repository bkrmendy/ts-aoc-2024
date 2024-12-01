import { lines, sum, words, zip } from '@/advent'

export function parse(input: string): [number[], number[]] {
  const rows = lines(input).map(l => words(l).map(Number))
  return [rows.map(r => r.at(0)!), rows.map(r => r.at(1)!)]
}

type Input = ReturnType<typeof parse>

export function partOne(input: Input) {
  const f = input[0].sort()
  const s = input[1].sort()
  return sum([...zip(f, s)].map(([a, b]) => Math.abs(a - b)))
}

export function partTwo(input: Input) {
  const f = input[0].sort()
  const s = input[1].sort()
  return sum(f.map(n => n * s.filter(nn => nn === n).length))
}
