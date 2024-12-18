import { lines } from '@/advent'

interface Machine {
  ra: number
  rb: number
  rc: number
  instrs: number[]
}

export function parse(input: string): Machine {
  const [a, b, c, program] = lines(input)
  const ra = [...a!.matchAll(/\d+/g)].map(Number).at(-1)!
  const rb = [...b!.matchAll(/\d+/g)].map(Number).at(-1)!
  const rc = [...c!.matchAll(/\d+/g)].map(Number).at(-1)!
  const instrs = [...program!.matchAll(/\d+/g)].map(Number)

  return { ra, rb, rc, instrs }
}

type Input = ReturnType<typeof parse>

const xor = (a: number, b: number): number => (a ^ b) >>> 0

function run(machine: Machine): number[] {
  let outputs: number[] = []
  let iptr = 0
  let current = { ...machine }

  const combo = (operand: number): number => {
    if (operand < 4) {
      return operand
    }
    switch (operand) {
      case 4:
        return current.ra
      case 5:
        return current.rb
      case 6:
        return current.rc
    }

    throw new Error(`Invalid combo operand: ${operand}`)
  }

  while (iptr < machine.instrs.length) {
    const instr = machine.instrs.at(iptr)!
    switch (instr) {
      case 0: {
        current.ra = Math.floor(
          current.ra / Math.pow(2, combo(machine.instrs.at(iptr + 1)!))
        )
        iptr += 2
        break
      }
      case 1: {
        current.rb = xor(current.rb, machine.instrs.at(iptr + 1)!)
        iptr += 2
        break
      }
      case 2: {
        current.rb = combo(machine.instrs.at(iptr + 1)!) % 8
        iptr += 2
        break
      }
      case 3: {
        if (current.ra == 0) {
          iptr += 2
        } else {
          iptr = machine.instrs.at(iptr + 1)!
        }
        break
      }
      case 4: {
        const brb = current.rb
        const brc = current.rc
        current.rb = xor(current.rb, current.rc)
        if (current.ra < 0 || current.rb < 0 || current.rc < 0) {
          console.log('>>>', iptr, instr, brb, brc, current.rb, current.rc)
          return []
        }
        iptr += 2
        break
      }
      case 5: {
        outputs.push(combo(machine.instrs.at(iptr + 1)!) % 8)
        iptr += 2
        break
      }
      case 6: {
        current.rb = Math.floor(
          current.ra / Math.pow(2, combo(machine.instrs.at(iptr + 1)!))
        )
        iptr += 2
        break
      }
      case 7: {
        current.rc = Math.floor(
          current.ra / Math.pow(2, combo(machine.instrs.at(iptr + 1)!))
        )
        iptr += 2
        break
      }
    }
  }

  return outputs
}

export function partOne(input: Input) {
  return run(input)
}

export function partTwo(input: Input) {
  let ra = 0
  let is = input.instrs.toReversed()
  for (const i of is) {
    ra = ra * 8 + i
  }
  return ra
}

// export function partTwo(input: Input) {
//   const program = input.instrs.join(',')
//   input.ra = 175657454975814
//   const res = run(input)
//   console.log(program)
//   console.log(res.join(','))
// }
