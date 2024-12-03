import { pipe } from 'effect'
import { sum } from '../advent'

type ParseResult<T> = [T, string]

function matchToken(
  letters: string,
  token: string
): ParseResult<string> | null {
  if ([...token].every((l, i) => letters.at(i) === l)) {
    return [token, letters.slice(token.length)]
  }
  return null
}

function matchNumber(letters: string): ParseResult<number> | null {
  let nums = ''
  while (letters.length > 0 && !isNaN(parseInt(letters[0]!))) {
    nums += letters[0]
    letters = letters.slice(1)
  }
  return nums.length > 0 ? [parseInt(nums), letters] : null
}

function matchExpr(letters: string): [number, number, string] | null {
  const open = matchToken(letters, '(')
  if (open == null) {
    return null
  }
  const n = matchNumber(open[1])
  if (n == null) {
    return null
  }
  const [num, commaRest] = n
  const comma = matchToken(commaRest, ',')
  if (comma == null) {
    return null
  }
  const nn = matchNumber(comma[1])
  if (nn == null) {
    return null
  }
  const [num2, closeRest] = nn
  const close = matchToken(closeRest, ')')
  if (close == null) {
    return null
  }
  return [num, num2, close[1]]
}

type Input = ReturnType<typeof parse>

function parsePt1(letters: string): [number, number][] {
  const mul = matchToken(letters, 'mul')
  if (mul != null) {
    const expr = matchExpr(mul[1])
    if (expr != null) {
      return [[expr[0], expr[1]], ...parsePt1(expr[2])]
    }
  }
  if (letters.length === 0) return []

  return parsePt1(letters.slice(1))
}

function parsePt2(letters: string, enabled: boolean): [number, number][] {
  const dont = matchToken(letters, "don't")
  if (dont != null) {
    return parsePt2(dont[1], false)
  }
  const doit = matchToken(letters, 'do')
  if (doit != null) {
    return parsePt2(doit[1], true)
  }
  const mul = matchToken(letters, 'mul')
  if (enabled && mul != null) {
    const expr = matchExpr(mul[1])
    if (expr != null) {
      return [[expr[0], expr[1]], ...parsePt2(expr[2], enabled)]
    }
  }
  if (letters.length === 0) return []

  return parsePt2(letters.slice(1), enabled)
}

export function parse(input: string): string {
  return input
}

const doMuls = (muls: [number, number][]) => muls.map(([a, b]) => a * b)

export function partOne(input: Input) {
  return pipe(input, parsePt1, doMuls, sum)
}

export function partTwo(input: Input) {
  return pipe(input, i => parsePt2(i, true), doMuls, sum)
}
