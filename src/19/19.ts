import { lines, memo, sum } from '@/advent'
import { pipe, Array } from 'effect'

export function parse(input: string) {
  const [patterns, ...designs] = lines(input)
  return { patterns: patterns!.split(', '), designs }
}

type Input = ReturnType<typeof parse>

const possible = memo(
  (_, d) => d,
  (patterns: string[], design: string): number => {
    if (design.length === 0) {
      return 1
    }

    return pipe(
      patterns,
      Array.filter(p => design.startsWith(p)),
      Array.map(p => possible(patterns, design.slice(p.length))),
      sum
    )
  }
)

export function partOne(input: Input) {
  return pipe(
    input.designs,
    Array.map(d => possible(input.patterns, d)),
    Array.filter(a => a != null),
    Array.length
  )
}

export function partTwo(input: Input) {
  return pipe(
    input.designs,
    Array.map(d => possible(input.patterns, d)),
    Array.filter(a => a != null),
    sum
  )
}
