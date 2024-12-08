import { curry, lines, pairs, zip } from '@/advent'
import { fromKey, Position, positionsEqual, toKey } from '@/move2d'
import { pipe, Array } from 'effect'

export function parse(input: string) {
  return lines(input).map(l => [...l])
}

type Input = ReturnType<typeof parse>

function getUniqueFrequencies(input: Input): string[] {
  const set = new Set(input.flatMap(row => row.filter(c => c !== '.')))
  return [...set]
}

function getNodesWithFrequency(input: Input, freq: string): Position[] {
  return input.flatMap((row, irow) =>
    row.flatMap((cell, icol) => (cell === freq ? [{ r: irow, c: icol }] : []))
  )
}

function inbounds(position: Position, input: Input): boolean {
  return (
    0 <= position.r &&
    position.r < input.length &&
    0 <= position.c &&
    position.c < input.at(position.r)!.length
  )
}

type Interferences = (input: Input, p1: Position, p2: Position) => Position[]

function interferences1(input: Input, p1: Position, p2: Position): Position[] {
  const [dr, dc] = [p2.r - p1.r, p2.c - p1.c] // vector from p1 to p2
  return [
    { r: p2.r + dr, c: p2.c + dc },
    { r: p1.r - dr, c: p1.c - dc }
  ].filter(p => inbounds(p, input))
}

function steps(
  from: Position,
  step: (_: Position) => Position | null
): Position[] {
  let current: Position | null = from
  let result: Position[] = []
  while (current != null) {
    result.push(current)
    current = step(current)
  }
  return result
}

function interferences2(input: Input, p1: Position, p2: Position): Position[] {
  const [dr, dc] = [p2.r - p1.r, p2.c - p1.c] // vector from p1 to p2
  const behind: Position[] = steps(p1, ({ r, c }) =>
    !inbounds({ r, c }, input) ? null : { r: r - dr, c: c - dc }
  )
  const ahead: Position[] = steps(p2, ({ r, c }) =>
    !inbounds({ r, c }, input) ? null : { r: r + dr, c: c + dc }
  )

  return [...behind, ...ahead]
}

function solve(input: Input, dpi: Interferences) {
  return pipe(
    input,
    getUniqueFrequencies,
    Array.flatMap(f =>
      pipe(
        f,
        curry(getNodesWithFrequency)(input),
        ns => [...pairs(ns)],
        Array.flatMap(([a, b]) => dpi(input, a, b))
      )
    ),
    Array.dedupeWith(positionsEqual),
    Array.length
  )
}

export const partOne = (input: Input) => solve(input, interferences1)
export const partTwo = (input: Input) => solve(input, interferences2)
