import { sum, words } from '@/advent'

export function parse(input: string) {
  return words(input).map(Number)
}

type Input = ReturnType<typeof parse>

const nDigits = (n: number) => Math.floor(Math.log10(n)) + 1

const split = (n: number): [number, number] => {
  let ds = nDigits(n)
  let tail = Math.pow(10, ds / 2)
  let start = n % tail
  let end = Math.floor(n / tail)
  return [end, start]
}

function blinkn(times: number, start: number): number {
  if (times === 0) {
    return 1
  }
  if (start === 0) {
    return 1
  }
  if (nDigits(start) % 2 == 0) {
    let [a, b] = split(start)
    return blinkn(times - 1, a) + blinkn(times - 1, b)
  }
  return blinkn(times - 1, start * 2024)
}

function blink(times: number, start: number[]): number[] {
  let current = start
  while (times > 0) {
    let current2 = []
    for (let i = current.length - 1; i >= 0; i--) {
      if (current[i] === 0) {
        current2.unshift(1)
      } else if (nDigits(current[i]!) % 2 == 0) {
        let [a, b] = split(current[i]!)
        current2.unshift(b)
        current2.unshift(a)
      } else {
        current2.unshift(current[i]! * 2024)
      }
    }
    current = current2
    times -= 1
  }
  return current
}

export function partOne(input: Input) {
  return sum(input.map(n => blinkn(5, n)))
  // return blink(25, input).length
}

export function partTwo(input: Input) {
  // return blink(75, input).length
}
