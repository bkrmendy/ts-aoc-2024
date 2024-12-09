import { lines, sum } from '@/advent'
import { Array, pipe } from 'effect'

export function parse(input: string): number[] {
  return [...lines(input).at(0)!].map(Number)
}

function ppt1(ns: number[]) {
  return ns.map(Number).flatMap((n, i) => {
    const isFree = i % 2 === 1
    const id = isFree ? -1 : i / 2
    if (n == 0) {
      return []
    }
    return Array.range(1, n).fill(id)
  })
}

interface Block {
  id: number
  space: number
}

function ppt2(ns: number[]): Block[] {
  return ns.map(Number).flatMap((n, i) => {
    const isFree = i % 2 === 1
    const id = isFree ? -1 : i / 2
    if (n == 0) {
      return []
    }
    return { id: id, space: n }
  })
}

type Input = ReturnType<typeof parse>

function rearrange(ns: number[]): number[] {
  let working = [...ns]
  while (true) {
    const nextNumber = working.findLastIndex(n => n >= 0)
    const nextSlot = working.findIndex(n => n < 0)
    if (nextSlot > nextNumber) {
      return working
    }
    working[nextSlot] = working[nextNumber]!
    working[nextNumber] = -1
  }
}

function checksum(ns: number[]): number {
  return sum([...ns.entries().map(([i, id]) => i * Math.max(id, 0))])
}

export function partOne(input: Input) {
  return pipe(input, ppt1, rearrange, checksum)
}

function moveInto(freeSpace: number, block: Block): Block[] {
  const remainingSpace = freeSpace - block.space
  if (remainingSpace < 1) {
    return [block]
  }
  return [block, { id: -3, space: remainingSpace }]
}

function rearrange2(ns: Block[]): Block[] {
  let working = [...ns]
  let remapped: Block[] = []

  while (working.length > 0) {
    const last = working.pop()!
    if (last.id < 0) {
      remapped.unshift(last)
      continue
    }

    const nextSlotIdx = working.findIndex(
      slot => slot.id < 0 && slot.space >= last.space
    )
    if (nextSlotIdx < 0) {
      remapped.unshift(last)
      continue
    }

    const free = working[nextSlotIdx]!.space

    const pre = working.slice(0, nextSlotIdx)
    const mapped = moveInto(free, last)
    const rest = working.slice(nextSlotIdx + 1)
    working = [...pre, ...mapped, ...rest, { space: last.space, id: -2 }]
  }

  return remapped
}

function p(blocks: Block[]) {
  return blocks
    .flatMap(({ id, space }) =>
      Array.range(1, space).map(() => (id < 0 ? '.' : id))
    )
    .join('')
}

function checksum2(ns: Block[]): number {
  return checksum(
    ns.flatMap(({ id, space }) => {
      if (space < 1) {
        throw new Error(`no space ${id}`)
      }
      return Array.range(1, space).fill(id)
    })
  )
}

export function partTwo(input: Input) {
  return pipe(input, ppt2, rearrange2, checksum2)
}
