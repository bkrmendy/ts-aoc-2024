import { findIndexFrom, findLastIndexFrom, lines, sum } from '@/advent'
import { Array, pipe } from 'effect'

export function parse(input: string): number[] {
  return [...lines(input).at(0)!].map(Number)
}

interface Block {
  id: number
  space: number
}

const parseBlocks =
  <T>(makeBlocks: (id: number, space: number) => T[]) =>
  (ns: number[]) => {
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

function rearrage1(blocks: number[]): number[] {
  let working = [...blocks]
  let firstSlotIdx = findIndexFrom(0, blocks, s => s < 0)!
  let lastFileIdx = findLastIndexFrom(working.length - 1, blocks, s => s >= 0)!

  while (firstSlotIdx < lastFileIdx) {
    working[firstSlotIdx] = working[lastFileIdx]!
    working[lastFileIdx] = -1
    firstSlotIdx = findIndexFrom(firstSlotIdx + 1, blocks, s => s < 0)!
    lastFileIdx = findLastIndexFrom(lastFileIdx - 1, blocks, s => s >= 0)!
  }

  return working
}

function rearrange2(blocks: Block[]): Block[] {
  let working = [...blocks]
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
    const mapped = moveInto(free, last)
    working.splice(nextSlotIdx, 1, ...mapped)
    working.push({ space: last.space, id: -1 })
  }

  return remapped
}

const checksumIds = (ids: number[]) =>
  [...ids.entries()].map(([i, id]) => i * Math.max(id, 0))

function checksumBlocks(ns: Block[]): number {
  return pipe(
    ns,
    Array.flatMap(({ id, space }) => Array.range(1, space).fill(id)),
    checksumIds,
    sum
  )
}

export function partOne(input: Input) {
  return pipe(
    input,
    parseBlocks((id, space) => Array.range(1, space).map(() => id)),
    rearrage1,
    checksumIds,
    sum
  )
}

export function partTwo(input: Input) {
  return pipe(
    input,
    parseBlocks((id, space) => [{ id, space }]),
    rearrange2,
    checksumBlocks
  )
}
