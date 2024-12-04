import { lines, range, sum } from '@/advent'

export function parse(input: string) {
  return lines(input).map(i => [...i])
}

type Input = ReturnType<typeof parse>

const get = (input: Input, [row, col]: [number, number]) =>
  input.at(row)?.at(col)

function getNWithStep(
  input: Input,
  from: [number, number],
  count: number,
  step: (_: [number, number]) => [number, number]
): string {
  let result = []
  for (const _ of range(0, count)) {
    result.push(get(input, from))
    from = step(from)
  }
  return result.join('')
}

function XMASCount(input: Input, [row, col]: [number, number]): number {
  const horizontal = getNWithStep(input, [row, col], 4, ([r, c]) => [r, c + 1])
  const vertical = getNWithStep(input, [row, col], 4, ([r, c]) => [r + 1, c])
  const downRight = getNWithStep(input, [row, col], 4, ([r, c]) => [
    r + 1,
    c + 1
  ])
  const downLeft = getNWithStep(input, [row, col], 4, ([r, c]) => [
    r + 1,
    c - 1
  ])

  return [horizontal, vertical, downRight, downLeft].filter(
    _ => _ === 'XMAS' || _ === 'SAMX'
  ).length
}

function points(input: Input) {
  const [rows, cols] = [input.length, input.at(0)!.length]
  return [...range(0, rows)].flatMap(r =>
    [...range(0, cols)].map((c): [number, number] => [r, c])
  )
}

// TODO: not the right answer
export function partOne(input: Input) {
  return sum(points(input).map(([r, c]) => XMASCount(input, [r, c])))
}

function SAMXCount(input: Input, [row, col]: [number, number]): number {
  const a = getNWithStep(input, [row, col], 3, ([r, c]) => [r + 1, c + 1])
  const b = getNWithStep(input, [row, col + 2], 3, ([r, c]) => [r + 1, c - 1])

  const matches = (a === 'MAS' || a === 'SAM') && (b === 'MAS' || b === 'SAM')
  return matches ? 1 : 0
}

export function partTwo(input: Input) {
  return sum(points(input).map(([r, c]) => SAMXCount(input, [r, c])))
}
