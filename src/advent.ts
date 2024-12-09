export const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0)
export const product = (ns: number[]) => ns.reduce((a, b) => a * b, 1)

export function* tails(line: string): Iterable<string> {
  for (let i = 0; i < line.length; i++) {
    yield line.slice(i, line.length)
  }
}

export function lines(input: string) {
  return input.split('\n').filter(l => l.length > 0)
}

export function words(line: string) {
  return line.split(' ').filter(w => w.length > 0)
}

export function* range(from: number, to: number): Iterable<number> {
  for (let i = from; i < to; i++) {
    yield i
  }
}

export function* matchAll(s: string, re: RegExp): Iterable<RegExpExecArray> {
  var match
  while ((match = re.exec(s)) != null) {
    yield match
  }
}

export function intersection<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter(x => b.has(x)))
}

export function maximum(numbers: number[]) {
  return Math.max(...numbers)
}

export function minimum(numbers: number[]) {
  return Math.min(...numbers)
}

export function gcd(a: number, b: number): number {
  if (b === 0) {
    return a
  }
  return gcd(b, a % b)
}

export function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b)
}

export function unsafeGet<T>(from: Record<string, T>, key: string): T {
  const value = from[key]
  if (value == null) {
    throw new Error(`Key not found: ${key}`)
  }
  return value
}

export function div(a: number, b: number): number {
  return Math.round(a / b)
}

export function curry<T, U, V>(fn: (a: T, b: U) => V) {
  return (a: T) => (b: U) => fn(a, b)
}

export function transpose<T>(input: T[][]): T[][] {
  return input[0]!.map((_, colIndex) => input.map(row => row[colIndex]!))
}

export function numericArrayEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((e, i) => b.at(i)! === e)
}

export function* pairs<T>(ts: T[]): Iterable<[T, T]> {
  for (let i = 0; i < ts.length; i++) {
    for (let j = i + 1; j < ts.length; j++) {
      yield [ts.at(i)!, ts.at(j)!]
    }
  }
}

export function findIndexFrom<T>(
  from: number,
  ts: T[],
  predicate: (b: T) => boolean
): number | null {
  if (from < 0 || ts.length <= from) {
    return null
  }
  for (let i = from; i < ts.length; i++) {
    let e = ts[i]
    if (e != null && predicate(e)) {
      return i
    }
  }
  return null
}

export function findLastIndexFrom<T>(
  from: number,
  ts: T[],
  predicate: (b: T) => boolean
): number | null {
  if (from < 0 || ts.length <= from) {
    return null
  }
  for (let i = from; i >= 0; i--) {
    let e = ts[i]
    if (e != null && predicate(e)) {
      return i
    }
  }
  return null
}
