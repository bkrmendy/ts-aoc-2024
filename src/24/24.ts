import { Array, Order, pipe } from 'effect'
import { assertNever, lines } from '../advent'

type Op = 'AND' | 'OR' | 'XOR'
const getOp = (raw: string): Op => {
  if (raw === 'AND' || raw === 'OR' || raw === 'XOR') {
    return raw
  }
  throw new Error(`Unrecognized op: ${raw}`)
}

interface Gate {
  a: string
  b: string
  op: 'AND' | 'OR' | 'XOR'
  dst: string
}

export function parse(input: string) {
  const [vs, gs] = input.split('\n\n')
  let values: Record<string, number> = {}
  lines(vs!).forEach(line => {
    const [name, value] = line.split(': ')
    values[name!] = parseInt(value!)
  })

  const gates = lines(gs!).map((line): Gate => {
    const [a, op, b, _, dst] = line.split(' ')
    return { a: a!, op: getOp(op!), b: b!, dst: dst! }
  })
  return { values, gates }
}

type Input = ReturnType<typeof parse>

const output = (bits: number[]): number =>
  bits.reduce((acc, val) => acc * 2 + val, 0)

function simulate(
  values: Record<string, number>,
  gates: Gate[]
): Record<string, number> {
  let result = { ...values }
  let q: Gate[] = [...gates]
  while (q.length > 0) {
    const next = q.shift()!
    const { a, b, op, dst } = next
    if (result[a] == null || result[b] == null) {
      q.push(next)
      continue
    }

    switch (op) {
      case 'AND':
        result[dst] = result[a]! & result[b]!
        break
      case 'OR':
        result[dst] = result[a]! | result[b]!
        break
      case 'XOR':
        result[dst] = result[a]! ^ result[b]!
        break
      default:
        assertNever(op)
    }
  }
  return result
}

const wiresWithPrefix = (
  wires: Record<string, number>,
  prefix: string
): number[] =>
  Object.entries(wires)
    .filter(([k, _]) => k.startsWith(prefix))
    .sort(([k1], [k2]) => (k1 > k2 ? -1 : 1))
    .map(([_, v]) => v)

export function partOne(input: Input) {
  return pipe(
    simulate(input.values, input.gates),
    ws => wiresWithPrefix(ws, 'z'),
    output
  )
}

const p2output = (wires: string[]) =>
  pipe(wires, Array.sort(Order.string), Array.join(','))

export function partTwo(input: Input) {
  let swapped: Set<string> = new Set()

  // TODO post-🎄: comment this
  input.gates.forEach(gate => {
    if (gate.dst.startsWith('z') && gate.op !== 'XOR' && gate.dst !== 'z45') {
      swapped.add(gate.dst)
    }

    if (
      gate.op === 'XOR' &&
      !['x', 'y', 'z'].includes(gate.dst[0]!) &&
      !['x', 'y', 'z'].includes(gate.a[0]!) &&
      !['x', 'y', 'z'].includes(gate.b[0]!)
    ) {
      swapped.add(gate.dst)
    }

    if (gate.op === 'AND' && ![gate.a, gate.b].includes('x00')) {
      input.gates.forEach(other => {
        if (
          (gate.dst === other.a || gate.dst === other.b) &&
          other.op !== 'OR'
        ) {
          swapped.add(gate.dst)
        }
      })
    }

    if (gate.op === 'XOR') {
      input.gates.forEach(other => {
        if (
          (gate.dst === other.a || gate.dst === other.b) &&
          other.op === 'OR'
        ) {
          swapped.add(gate.dst)
        }
      })
    }
  })

  return p2output([...swapped])
}
