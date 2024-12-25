import { lines, transpose } from '@/advent'
import { Array, pipe } from 'effect'

export const parse = (input: string) =>
  input.split('\n\n').map(i => lines(i).map(l => [...l]))

type Input = ReturnType<typeof parse>

const isType =
  ({ upper, lower }: { upper: string; lower: string }) =>
  (schematic: string[][]) =>
    schematic.at(0)!.every(i => i === upper) &&
    schematic.at(-1)!.every(i => i === lower)

const toHeights = (schematic: string[][]) =>
  transpose(schematic).map(c => c.filter(a => a === '#').length - 1)

export function partOne(input: Input) {
  const locks = input.filter(isType({ upper: '#', lower: '.' })).map(toHeights)
  const keys = input.filter(isType({ upper: '.', lower: '#' })).map(toHeights)

  let result: number = 0
  for (const lock of locks) {
    for (const key of keys) {
      if (Array.zipWith(lock, key, (a, b) => a + b).every(s => s < 6)) {
        result += 1
      }
    }
  }
  return result
}

export function partTwo(input: Input) {
  return 'Chronicle Delivered'
}
