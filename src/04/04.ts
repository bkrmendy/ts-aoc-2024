import { lines, range, sum, tails, transpose } from '@/advent'

export function parse(input: string) {
  return lines(input).map(i => [...i])
}

type Input = ReturnType<typeof parse>

function rotate90(input: Input) {
  return transpose(input)
}

const inBounds = (input: Input, [row, col]: [number, number]) =>
  row >= 0 && row < input.length && col >= 0 && col < input[0]!.length

function rotate45(input: Input): Input {
  const step = ([row, col]: [number, number]): [number, number] => [
    row + 1,
    col + 1
  ]

  const result: Input = []
  for (let iCol = input.at(0)!.length - 1; iCol >= 0; iCol--) {
    let pos: [number, number] = [0, iCol]
    let row: string[] = []
    while (inBounds(input, pos)) {
      row.push(input.at(pos[0])!.at(pos[1])!)
      let [nr, nc] = step(pos)
      pos = [nr, nc]
    }
    result.push(row)
  }

  for (let iRow = 1; iRow < input.length; iRow++) {
    let pos: [number, number] = [iRow, 0]
    let row: string[] = []
    while (inBounds(input, pos)) {
      row.push(input.at(pos[0])!.at(pos[1])!)
      let [nr, nc] = step(pos)
      pos = [nr, nc]
    }
    result.push(row)
  }
  return result
}

function rotateMinus45(input: Input): Input {
  const step = ([row, col]: [number, number]): [number, number] => [
    row - 1,
    col + 1
  ]

  const result: Input = []
  for (let iRow = 0; iRow < input.length; iRow++) {
    let pos: [number, number] = [iRow, 0]
    let row: string[] = []
    while (inBounds(input, pos)) {
      row.push(input.at(pos[0])!.at(pos[1])!)
      let [nr, nc] = step(pos)
      pos = [nr, nc]
    }
    result.push(row)
  }

  for (let iCol = 1; iCol < input.at(0)!.length; iCol++) {
    let pos: [number, number] = [input.length - 1, iCol]
    let row: string[] = []
    while (inBounds(input, pos)) {
      row.push(input.at(pos[0])!.at(pos[1])!)
      let [nr, nc] = step(pos)
      pos = [nr, nc]
    }
    result.push(row)
  }
  return result
}

function count(input: Input): number {
  return sum(
    input.flatMap(row => {
      const line = row.join('')
      let total = 0
      for (const tail of tails(line)) {
        if (tail.startsWith('XMAS')) {
          total += 1
        }
      }

      const reversed = [...row].reverse()

      for (const tail of tails(reversed.join(''))) {
        if (tail.startsWith('XMAS')) {
          total += 1
        }
      }
      return total
    })
  )
}

export function partOne(input: Input) {
  return sum([
    count(input),
    count(rotate90(input)),
    count(rotate45(input)),
    count(rotateMinus45(input))
  ])
}

export function partTwo(input: Input) {}
