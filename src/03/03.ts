import { pipe, Option } from 'effect'
import { curry, sum } from '../advent'

type ParseResult<T> = Option.Option<[T, string]>

function matchToken(letters: string, token: string): ParseResult<string> {
  if ([...token].every((l, i) => letters.at(i) === l)) {
    return Option.some([token, letters.slice(token.length)])
  }
  return Option.none()
}

function matchNumber(letters: string): ParseResult<number> {
  let nums = ''
  while (letters.length > 0 && !isNaN(parseInt(letters[0]!))) {
    nums += letters[0]
    letters = letters.slice(1)
  }
  return nums.length > 0
    ? Option.some([parseInt(nums), letters])
    : Option.none()
}

function matchExpr(letters: string): ParseResult<[number, number]> {
  const open = Option.getOrNull(matchToken(letters, '('))
  if (open == null) {
    return Option.none()
  }
  const n = Option.getOrNull(matchNumber(open[1]))
  if (n == null) {
    return Option.none()
  }
  const [num, commaRest] = n
  const comma = Option.getOrNull(matchToken(commaRest, ','))
  if (comma == null) {
    return Option.none()
  }
  const nn = Option.getOrNull(matchNumber(comma[1]))
  if (nn == null) {
    return Option.none()
  }
  const [num2, closeRest] = nn
  const close = Option.getOrNull(matchToken(closeRest, ')'))
  if (close == null) {
    return Option.none()
  }
  return Option.some([[num, num2], close[1]])
}

type Input = ReturnType<typeof parse>

function parsePt1(letters: string): [number, number][] {
  const mul = Option.getOrNull(matchToken(letters, 'mul'))
  if (mul != null) {
    const expr = Option.getOrNull(matchExpr(mul[1]))
    if (expr != null) {
      return [expr[0], ...parsePt1(expr[1])]
    }
  }
  if (letters.length === 0) return []

  return parsePt1(letters.slice(1))
}

function parsePt2(enabled: boolean, letters: string): [number, number][] {
  const dont = Option.getOrNull(matchToken(letters, "don't"))
  if (dont != null) {
    return parsePt2(false, dont[1])
  }
  const doit = Option.getOrNull(matchToken(letters, 'do'))
  if (doit != null) {
    return parsePt2(true, doit[1])
  }
  const mul = Option.getOrNull(matchToken(letters, 'mul'))
  if (enabled && mul != null) {
    const expr = Option.getOrNull(matchExpr(mul[1]))
    if (expr != null) {
      return [expr[0], ...parsePt2(enabled, expr[1])]
    }
  }
  if (letters.length === 0) return []

  return parsePt2(enabled, letters.slice(1))
}

export function parse(input: string): string {
  return input
}

const doMuls = (muls: [number, number][]) => muls.map(([a, b]) => a * b)

export function partOne(input: Input) {
  return pipe(input, parsePt1, doMuls, sum)
}

export function partTwo(input: Input) {
  return pipe(input, curry(parsePt2)(true), doMuls, sum)
}
