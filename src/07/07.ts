import { lines, sum, words } from '@/advent'
import { Array, pipe } from 'effect'

export function parse(input: string) {
  return lines(input).map(l => {
    const [k, v] = l.split(': ')
    return { k: parseInt(k!), v: words(v!).map(Number) }
  })
}

type Input = ReturnType<typeof parse>

function addUp(acc: number, ns: number[]): number[] {
  const [n, ...rest] = ns
  if (n == null) {
    return [acc]
  }

  return [...addUp(acc + n, rest), ...addUp(acc * n, rest)]
}

function addUpWithConcat(acc: number, ns: number[]): number[] {
  const [n, ...rest] = ns
  if (n == null) {
    return [acc]
  }

  return [
    ...addUpWithConcat(acc + n, rest),
    ...addUpWithConcat(acc * n, rest),
    ...addUpWithConcat(parseInt(`${acc}${n}`), rest)
  ]
}

const solve =
  (method: (acc: number, ns: number[]) => number[]) => (input: Input) =>
    pipe(
      input,
      Array.filter(({ k, v: [n, ...rest] }) =>
        method(n!, rest).some(r => r === k)
      ),
      Array.map(({ k }) => k),
      sum
    )

export const partOne = solve(addUp)
export const partTwo = solve(addUpWithConcat)
