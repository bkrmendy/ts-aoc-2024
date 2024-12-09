import { lines, sum } from '@/advent'
import { Array, pipe } from 'effect'

export function parse(input: string): number[] {
  return [...lines(input).at(0)!].map(Number)
}

interface Block {
  id: number
  space: number
}

const ppt1 =
  (makeBlocks: (id: number, space: number) => Block[]) => (ns: number[]) => {
    return ns.map(Number).flatMap((n, i) => {
      const isFree = i % 2 === 1
      const id = isFree ? -1 : i / 2
      if (n == 0) {
        return []
      }
      return makeBlocks(id, n)
    })
  }

type Input = ReturnType<typeof parse>

function moveInto(freeSpace: number, block: Block): Block[] {
  const remainingSpace = freeSpace - block.space
  if (remainingSpace < 1) {
    return [block]
  }
  return [block, { id: -3, space: remainingSpace }]
}

function rearrange(ns: Block[]): Block[] {
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

function checksum(ns: Block[]): number {
  return pipe(
    ns,
    Array.flatMap(({ id, space }) => Array.range(1, space).fill(id)),
    ns => [...ns.entries()],
    Array.map(([i, id]) => i * Math.max(id, 0)),
    sum
  )
}

export function partOne(input: Input) {
  return pipe(
    input,
    ppt1((id, space) =>
      Array.range(1, space).map(() => ({ id: id, space: 1 }))
    ),
    rearrange,
    checksum
  )
}

export function partTwo(input: Input) {
  return pipe(
    input,
    ppt1((id, space) => [{ id, space }]),
    rearrange,
    checksum
  )
}
