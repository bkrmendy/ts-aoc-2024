import { lines, memo, sum } from '@/advent'
import { Array, pipe } from 'effect'

export const parse = (input: string) =>
  pipe(
    lines(input),
    Array.map(bank => [...bank].map(i => parseInt(i, 10)))
  )

type Input = ReturnType<typeof parse>

const conc = (a: number, b: number) =>
  b === 0 ? a : a * 10 ** b.toString().length + b

const solve = (batteries: number) => (input: Input) =>
  pipe(
    input,
    Array.map(jolts => {
      const largest = memo(
        (r, n) => `${r}-${n}`,
        (digits: number, from: number): number => {
          if (digits === 0) {
            return 0
          }

          const next = jolts[from]
          if (next == null) {
            return 0
          }

          return Math.max(
            largest(digits, from + 1),
            conc(next, largest(digits - 1, from + 1))
          )
        }
      )
      return largest(batteries, 0)
    }),
    sum
  )

export const partOne = solve(2)
export const partTwo = solve(12)
