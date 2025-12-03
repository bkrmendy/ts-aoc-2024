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

export const partTwo = (input: Input) => {
  let result = 0
  for (const [from, to] of input) {
    const invalid = new Set<number>()
    for (let i = from; i <= to; i++) {
      const n = i.toString()
      for (let upto = 1; upto <= n.length / 2; upto++) {
        const start = n.slice(0, upto)
        if (n === start.repeat(n.length / upto)) {
          invalid.add(i)
        }
      }
    }
    result += sum([...invalid])
  }
  return result
}
