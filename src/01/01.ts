import { lines, sum, words, zip } from '@/advent'

export function parse(input: string) {
  return lines(input).map(l => words(l).map(Number))
}

type Input = ReturnType<typeof parse>

export function partOne(input: Input) {
  const f = input.map(i => i.at(0)!).sort()
  const s = input.map(i => i.at(1)!).sort()
  return sum([...zip(f, s)].map(([a, b]) => Math.abs(a - b)))
}

export function partTwo(input: Input) {
  const f = input.map(i => i.at(0)!)
  const s = input.map(i => i.at(1)!)
  return sum(f.map(n => s.filter(nn => nn === n).length * n))
}
