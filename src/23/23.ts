import { lines } from '@/advent'
import { Array, pipe } from 'effect'

export function parse(input: string): Record<string, string[]> {
  let result: Record<string, string[]> = {}
  for (const line of lines(input)) {
    const [from, to] = line.split('-') as [string, string]
    if (result[from] == null) {
      result[from] = []
    }
    result[from].push(to)
    if (result[to] == null) {
      result[to] = []
    }
    result[to].push(from)
  }
  return result
}

type Input = ReturnType<typeof parse>

function isConnected(input: Input, from: string, to: string): boolean {
  return input[from]!.includes(to)
}

function components(input: Input): string[][] {
  let result: string[][] = []

  for (const [from, neighbors] of Object.entries(input)) {
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        const neighbor1 = neighbors[i]!
        const neighbor2 = neighbors[j]!

        // Check if neighbor1 and neighbor2 are connected
        if (input[neighbor1]?.includes(neighbor2)) {
          // Sort the clique to avoid duplicates
          const clique = [from, neighbor1, neighbor2].sort()
          // Add the clique if it's not already in the result
          if (!result.some(c => JSON.stringify(c) === JSON.stringify(clique))) {
            result.push(clique)
          }
        }
      }
    }
  }

  return result
}

export function partOne(input: Input) {
  const cs = pipe(
    input,
    components,
    Array.filter(g => g.some(c => c.startsWith('t'))),
    Array.length
  )
  return cs
}

export function partTwo(input: Input) {}
