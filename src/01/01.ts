import { lines, sum, words } from '@/advent'
import { pipe, Array } from 'effect'

export function parse(input: string): [number[], number[]] {
  const rows = lines(input).map(l => words(l).map(Number))
  return [rows.map(r => r.at(0)!).sort(), rows.map(r => r.at(1)!).sort()]
}

type Input = ReturnType<typeof parse>

export function partOne(input: Input) {
  const [f, s] = input
  return pipe(
    Array.zip(f, s),
    Array.map(([a, b]) => Math.abs(a - b)),
    sum
  )
}

export function partTwo(input: Input) {
  const [f, s] = input
  let sCounts: Record<string, number> = {}
  s.forEach(val => (sCounts[val] = (sCounts[val] ?? 0) + 1))
  return sum(f.map(n => n * (sCounts[n] ?? 0)))
}
