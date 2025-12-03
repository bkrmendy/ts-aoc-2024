import { sum } from '@/advent'
import { Array, Option, pipe } from 'effect'

export const parse = (input: string) =>
  pipe(
    input.split(','),
    Array.map((range): [number, number] => {
      const [from, to] = range.split('-')
      return [parseInt(from!), parseInt(to!)]
    })
  )

type Input = ReturnType<typeof parse>

const solve = (fn: (_: number) => boolean) => (input: Input) =>
  pipe(
    input,
    Array.map(([from, to]) =>
      pipe(Array.range(from, to), Array.filter(fn), sum)
    ),
    sum
  )

export const partOne = solve(i => {
  const n = i.toString()
  const start = n.slice(0, n.length / 2)
  return n === start.repeat(2)
})

export const partTwo = solve(i => {
  const n = i.toString()
  return pipe(
    Array.range(1, n.length / 2),
    Array.findFirst(upTo => {
      const start = n.slice(0, upTo)
      return n === start.repeat(n.length / upTo)
    }),
    Option.isSome
  )
})
