import { sum } from '../advent'

interface ParseResult<T> {
  value: T
  rest: string[]
}

function matchToken(
  letters: string[],
  token: string
): ParseResult<string> | null {
  if ([...token].every((l, i) => letters.at(i) === l)) {
    return { value: token, rest: letters.slice(token.length) }
  }
  return null
}

function matchNumber(letters: string[]): ParseResult<number> | null {
  let nums = ''
  while (letters.length > 0 && !isNaN(parseInt(letters[0]!))) {
    nums += letters[0]
    letters = letters.slice(1)
  }
  return nums.length > 0 ? { value: parseInt(nums), rest: letters } : null
}

function matchExpr(letters: string[]): [number, number, string[]] | null {
  const open = matchToken(letters, '(')
  if (open == null) {
    return null
  }
  const n = matchNumber(open.rest)
  if (n == null) {
    return null
  }
  const { value: num } = n
  const comma = matchToken(n.rest, ',')
  if (comma == null) {
    return null
  }
  const nn = matchNumber(comma.rest)
  if (nn == null) {
    return null
  }
  const { value: num2 } = nn
  const close = matchToken(nn.rest, ')')
  if (close == null) {
    return null
  }
  return [num, num2, close.rest]
}

type Input = ReturnType<typeof parse>

function parsePt1(input: string) {
  return [...input.matchAll(/mul\((\d+),(\d+)\)/g)]
}

function parsePt2(letters: string[], enabled: boolean): [number, number][] {
  const dont = matchToken(letters, "don't")
  if (dont != null) {
    return parsePt2(dont.rest, false)
  }
  const doit = matchToken(letters, 'do')
  if (doit != null) {
    return parsePt2(doit.rest, true)
  }
  const mul = matchToken(letters, 'mul')
  if (enabled && mul != null) {
    const expr = matchExpr(mul.rest)
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

export function partOne(input: Input) {
  const matches = parsePt1(input)
  return sum(matches.map(([_, a, b]) => parseInt(a!) * parseInt(b!)))
}

export function partTwo(input: Input) {
  const muls = parsePt2(input.split(''), true)
  return sum(muls.map(([a, b]) => a * b))
}
