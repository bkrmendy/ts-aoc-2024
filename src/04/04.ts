import { lines, range, sum, transpose } from '@/advent'

export function parse(input: string) {
  return lines(input).map(i => [...i])
}

type Input = ReturnType<typeof parse>

const inBounds = (coords: [number, number], bounds: [number, number]) =>
  coords[0] >= 0 &&
  coords[0] < bounds[0] &&
  coords[1] >= 0 &&
  coords[1] < bounds[1]

function* coords(
  from: [number, number],
  bounds: [number, number],
  step: (_: [number, number]) => [number, number]
): Iterable<[number, number]> {
  let [sRow, sCol] = from

  while (inBounds([sRow, sCol], bounds)) {
    yield [sRow, sCol]
    const [nRow, nCol] = step([sRow, sCol])
    sRow = nRow
    sCol = nCol
  }
  yield [sRow, sCol]
}

const getBounds = (input: Input): [number, number] => [
  input.length,
  input.at(0)!.length
]

const getLetter = (input: Input, coords: [number, number]) =>
  input.at(coords[0])?.at(coords[1])

function trace(input: Input, steps: [number, number][]): number {
  let total = 0
  for (let i = 0; i < steps.length; i++) {
    const word = steps
      .slice(i, i + 4)
      .map(c => getLetter(input, c))
      .join('')
    if (word === 'XMAS') {
      total += 1
    }
  }
  return total
}

function rotate90(input: Input) {
  return transpose(input)
}

export function partOne(input: Input) {
  const bounds = getBounds(input)
  const [rows, cols] = bounds
  const horizontal = sum(
    [...range(0, rows)].flatMap(r => [
      trace(input, [...coords([r, 0], bounds, ([r, c]) => [r, c + 1])]), // right
      trace(input, [...coords([r, cols - 1], bounds, ([r, c]) => [r, c - 1])]) // left
    ])
  )

  const vertical = sum(
    [...range(0, cols)].flatMap(c => [
      trace(input, [...coords([0, c], bounds, ([r, c]) => [r + 1, c])]), // down
      trace(input, [...coords([rows - 1, c], bounds, ([r, c]) => [r - 1, c])]) // up
    ])
  )

  const rowsRight = sum(
    [...range(0, rows)].flatMap(r => [
      trace(input, [...coords([r, 0], bounds, ([r, c]) => [r + 1, c + 1])]), // down right
      trace(input, [...coords([r, 0], bounds, ([r, c]) => [r - 1, c + 1])]) // up right
    ])
  )

  const rowsLeft = sum(
    [...range(0, rows)].flatMap(r => [
      trace(input, [
        ...coords([r, cols - 1], bounds, ([r, c]) => [r + 1, c - 1])
      ]), // down left
      trace(input, [
        ...coords([r, cols - 1], bounds, ([r, c]) => [r - 1, c - 1])
      ]) // up left
    ])
  )

  const colsUp = sum(
    [...range(0, cols - 1)].flatMap(c => [
      trace(input, [
        ...coords([rows - 1, c], bounds, ([r, c]) => [r - 1, c + 1])
      ]), // up right
      trace(input, [
        ...coords([rows - 1, c], bounds, ([r, c]) => [r - 1, c - 1])
      ]) // up left
    ])
  )

  const colsDown = sum(
    [...range(1, cols)].flatMap(c => [
      trace(input, [...coords([0, c], bounds, ([r, c]) => [r + 1, c + 1])]), // down right
      trace(input, [...coords([0, c], bounds, ([r, c]) => [r + 1, c - 1])]) // down left
    ])
  )

  return sum([horizontal, vertical, rowsRight, rowsLeft, colsDown, colsUp])
}

export function partTwo(input: Input) {}
