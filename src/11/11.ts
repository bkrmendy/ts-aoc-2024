import { memo, sum, words } from '@/advent'
import { Array, pipe } from 'effect'

export function parse(input: string) {
  return words(input).map(Number)
}

type Input = ReturnType<typeof parse>

const nDigits = (n: number) => Math.floor(Math.log10(n)) + 1

const split = (n: number): [number, number] => {
  let ds = nDigits(n)
  let tail = Math.pow(10, ds / 2)
  let start = n % tail
  let end = Math.floor(n / tail)
  return [end, start]
}

const blink = memo(
  (t, s) => `${t}-${s}`,
  (times: number, stone: number): number => {
    if (times === 0) {
      return 1
    }

    if (stone === 0) {
      return blink(times - 1, 1)
    }
    if (nDigits(stone) % 2 == 0) {
      let [a, b] = split(stone)
      return blink(times - 1, a) + blink(times - 1, b)
    }
    return blink(times - 1, stone * 2024)
  }
)

const solve = (times: number) => (input: Input) =>
  pipe(
    input,
    Array.map(n => blink(times, n)),
    sum
  )

export const partOne = solve(25)
export const partTwo = solve(75)
