import { lines, maximum, sum, window } from '@/advent'
import { Array, pipe } from 'effect'

export function parse(input: string) {
  return lines(input).map(Number)
}

const xor = (a: number, b: number) => (a ^ b) >>> 0

const prune = (n: number) => n % 16777216

function evolve(n: number): number {
  const m64 = prune(xor(n, n * 64))
  const d32 = prune(xor(m64, Math.floor(m64 / 32)))
  return prune(xor(d32, d32 * 2048))
}

function gen(n: number): number[] {
  let result = [n]
  for (let i = 0; i < 2000; i++) {
    result.push(evolve(result.at(-1)!))
  }
  return result
}

type Input = ReturnType<typeof parse>

export function partOne(input: Input) {
  return pipe(
    input,
    Array.map(gen),
    Array.map(ns => ns.at(-1)!),
    sum
  )
}

function ones(secrets: number[]): number[] {
  return secrets.map(s => s % 10)
}

function changes(ns: number[]): number[] {
  return Array.zipWith(ns, ns.slice(1), (a, b) => b - a)
}

function sequenceMap(ns: number[]): Record<string, number> {
  const os = ones(ns)
  const cs = changes(os)

  let map: Record<string, number> = {}
  let iw = 4
  for (const w of window(4, cs)) {
    const seq = w.join(',')
    if (map[seq] == null || map[seq] < os.at(iw)!) {
      map[seq] = os.at(iw)!
    }
    iw += 1
  }
  return map
}

export function partTwo(input: Input) {
  const sequenceMappings = input.map(gen).map(sequenceMap)
  const allSequences: Set<string> = new Set()
  for (const s of sequenceMappings) {
    for (const k of Object.keys(s)) {
      allSequences.add(k)
    }
  }

  let max: { seq: string; val: number } | null = null
  let i = 1
  for (const seq of allSequences) {
    console.log(i, '/', allSequences.size)
    i++
    const total = sum(sequenceMappings.map(s => s[seq] ?? 0))
    if (max == null || max.val < total) {
      max = { seq, val: total }
    }
  }
  console.log(max)
  return max!.val
}
