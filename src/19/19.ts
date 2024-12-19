import { lines, memo, sum } from '@/advent'
import { pipe, Array } from 'effect'

export function parse(input: string) {
  const [patterns, ...designs] = lines(input)
  return { patterns: patterns!.split(', '), designs }
}

type Input = ReturnType<typeof parse>

const possible = memo(
  (_, d) => d,
  (patterns: string[], design: string): number =>
    design.length === 0
      ? 1
      : pipe(
          patterns,
          Array.filter(p => design.startsWith(p)),
          Array.map(p => possible(patterns, design.slice(p.length))),
          sum
        )
)

const solve = (result: (_: number[]) => number) => (input: Input) =>
  pipe(
    input.designs,
    Array.map(d => possible(input.patterns, d)),
    Array.filter(a => a != null),
    result
  )

export const partOne = solve(_ => _.length)
export const partTwo = solve(sum)
