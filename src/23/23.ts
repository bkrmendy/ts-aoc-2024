import { intersection, lines } from '@/advent'
import { Array, Order, pipe } from 'effect'

export function parse(input: string): Record<string, string[]> {
  let result: Record<string, string[]> = {}
  for (const line of lines(input)) {
    const [from, to] = line.split('-') as [string, string]
    result[from] = (result[from] || []).concat(to)
    result[to] = (result[to] || []).concat(from)
  }
  return result
}

type Input = ReturnType<typeof parse>

const findAllCliques =
  (stop: (_: { R: Set<string>; P: Set<string>; X: Set<string> }) => boolean) =>
  (input: Record<string, string[]>): string[][] => {
    const result: string[][] = []

    // https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
    function bronKerbosch(R: Set<string>, P: Set<string>, X: Set<string>) {
      if (stop({ R, P, X })) {
        result.push([...R])
        return
      }

      for (const node of P) {
        const neighbors = new Set(input[node])

        bronKerbosch(
          new Set([...R, node]),
          new Set(intersection(P, neighbors)),
          new Set(intersection(X, neighbors))
        )

        P.delete(node)
        X.add(node)
      }
    }

    bronKerbosch(new Set(), new Set(Object.keys(input)), new Set())
    return result
  }

export const partOne = (input: Input) =>
  pipe(
    input,
    findAllCliques(({ R }) => R.size === 3),
    Array.filter(g => g.some(c => c.startsWith('t'))),
    Array.length
  )

const password = (nodes: string[]) =>
  pipe(nodes, Array.sort(Order.string), Array.join(','))

export const partTwo = (input: Input) =>
  pipe(
    input,
    findAllCliques(({ P, X }) => P.size === 0 && X.size === 0),
    cs => cs.sort((a, b) => a.length - b.length),
    cs => cs.at(-1)!,
    password
  )
