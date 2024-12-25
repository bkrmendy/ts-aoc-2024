import { lines, transpose } from '@/advent'
import { toKey } from '@/move2d'
import { Array, pipe } from 'effect'

export const parse = (input: string) =>
  input.split('\n\n').map(i => lines(i).map(l => [...l]))

type Input = ReturnType<typeof parse>

const isLock = (schematic: string[][]) =>
  schematic.at(0)!.every(i => i === '#') &&
  schematic.at(-1)!.every(i => i === '.')

const isKey = (schematic: string[][]) =>
  schematic.at(0)!.every(i => i === '.') &&
  schematic.at(-1)!.every(i => i === '#')

const toHeights = (schematic: string[][]) =>
  transpose(schematic).map(c => c.filter(a => a === '#').length - 1)

export function partOne(input: Input) {
  const locks = input.filter(isLock).map(toHeights)
  const keys = input.filter(isKey).map(toHeights)

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
