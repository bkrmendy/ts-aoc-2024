import { lines, sum } from '@/advent'
import { pipe, Array, identity, Option } from 'effect'

interface Machine {
  a: [number, number]
  b: [number, number]
  prize: [number, number]
}

export function parse(input: string) {
  return pipe(
    input,
    lines,
    Array.chunksOf(3),
    Array.map(([a, b, prize]): Machine => {
      let [ax, ay] = [...a!.matchAll(/\d+/g)].map(Number)
      let [bx, by] = [...b!.matchAll(/\d+/g)].map(Number)
      let [px, py] = [...prize!.matchAll(/\d+/g)].map(Number)
      return { a: [ax!, ay!], b: [bx!, by!], prize: [px!, py!] }
    })
  )
}

type Input = ReturnType<typeof parse>

function getWinningCost(
  machine: Machine
): Option.Option<{ a: number; b: number }> {
  const {
    a: [ax, ay],
    b: [bx, by],
    prize: [px, py]
  } = machine
  const determinant = ax * by - bx * ay

  if (determinant === 0) {
    console.log(
      'The determinant is zero, so the equations have no unique solution.'
    )
    return Option.none()
  }

  // Calculate a and b using the rearranged equations
  const a = (by * px - bx * py) / determinant
  const b = (-ay * px + ax * py) / determinant

  if (Number.isInteger(a) && Number.isInteger(b)) {
    return Option.some({ a, b })
  }

  return Option.none()
}

const solve = (tweak: (_: number) => number) => (input: Input) =>
  pipe(
    input,
    Array.map(
      (machine): Machine => ({
        ...machine,
        prize: [tweak(machine.prize[0]), tweak(machine.prize[1])]
      })
    ),
    Array.map(machine =>
      pipe(
        getWinningCost(machine),
        Option.map(({ a, b }) => a * 3 + b),
        Option.getOrElse(() => 0)
      )
    ),
    sum
  )

export const partOne = solve(identity)

export const partTwo = solve(n => n + 10000000000000)
