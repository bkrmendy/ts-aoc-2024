import { sum } from '../advent'

interface ParseResult<T> {
  value: T
  rest: string[]
}

function matchMul(letters: string[]): ParseResult<[number, number]> | null {
  const [m, u, l, ...rest] = letters
  if (m !== 'm' || u !== 'u' || l !== 'l') {
    return null
  }
  return { value: [parseInt(m), parseInt(u)], rest }
}

function matchDo(letters: string[]): ParseResult<'do'> | null {
  const [d, o, ...rest] = letters
  if (d !== 'd' || o !== 'o') {
    return null
  }
  return { value: 'do', rest }
}

function matchDont(letters: string[]): ParseResult<"don't"> | null {
  const [d, o, n, apo, t, ...rest] = letters
  if (d !== 'd' || o !== 'o' || n !== 'n' || apo !== "'" || t !== 't') {
    return null
  }
  return { value: "don't", rest }
}

function matchChar(
  letters: string[],
  char: string
): ParseResult<string> | null {
  if (letters[0] !== char) {
    return null
  }
  return { value: char, rest: letters.slice(1) }
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
  const open = matchChar(letters, '(')
  if (open == null) {
    return null
  }
  const n = matchNumber(open.rest)
  if (n == null) {
    return null
  }
  const { value: num } = n
  const comma = matchChar(n.rest, ',')
  if (comma == null) {
    return null
  }
  const nn = matchNumber(comma.rest)
  if (nn == null) {
    return null
  }
  const { value: num2 } = nn
  const close = matchChar(nn.rest, ')')
  if (close == null) {
    return null
  }
  return [num, num2, close.rest]
}

function parseI(letters: string[], enabled: boolean): [number, number][] {
  const dont = matchDont(letters)
  if (dont != null) {
    return parseI(dont.rest, false)
  }
  const doit = matchDo(letters)
  if (doit != null) {
    return parseI(doit.rest, true)
  }
  const mul = matchMul(letters)
  if (enabled && mul != null) {
    const expr = matchExpr(mul.rest)
    if (expr != null) {
      return [[expr[0], expr[1]], ...parseI(expr[2], enabled)]
    }
  }
  if (letters.length === 0) return []

  return parseI(letters.slice(1), enabled)
}

export function parse(input: string): string {
  return input
}

type Input = ReturnType<typeof parse>

export function partOne(input: Input) {
  const matches = [...input.matchAll(/mul\((\d+),(\d+)\)/g)]
  return sum(matches.map(([_, a, b]) => parseInt(a!) * parseInt(b!)))
}

export function partTwo(input: Input) {
  const muls = parseI(input.split(''), true)
  return sum(muls.map(([a, b]) => a * b))
}
