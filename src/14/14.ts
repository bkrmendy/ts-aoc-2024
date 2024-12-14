import { lines, mod, product, range } from '../advent'
import { Position, toKey, step } from '@/move2d'

interface Robot {
  p: Position
  vx: number
  vy: number
}

export function parse(input: string) {
  return lines(input).map((l): Robot => {
    const [px, py, vx, vy] = [...l.matchAll(/-?\d+/g)].map(s => parseInt(s[0]))
    return { p: { r: py!, c: px! }, vx: vx!, vy: vy! }
  })
}

type Input = ReturnType<typeof parse>

const W = 101
const H = 103

const move = (robot: Robot): Robot => ({
  vx: robot.vx,
  vy: robot.vy,
  p: { r: mod(robot.p.r + robot.vy, H), c: mod(robot.p.c + robot.vx, W) }
})

const inQuadrant = (from: Position, to: Position, robot: Robot): boolean =>
  from.r <= robot.p.r &&
  robot.p.r < to.r &&
  from.c <= robot.p.c &&
  robot.p.c < to.c

const partition = (n: number): [number, number] => [
  Math.floor(n / 2),
  Math.ceil(n / 2)
]

const count = (robots: Robot[], from: Position, to: Position): number =>
  robots.filter(r => inQuadrant(from, to, r)).length

export function partOne(input: Input) {
  let robots = [...input]
  for (const _ of range(0, 100)) {
    robots = robots.map(move)
  }

  const [lowerRow, upperRow] = partition(H)
  const [lowerCol, upperCol] = partition(W)

  const tl = count(robots, { r: 0, c: 0 }, { r: lowerRow, c: lowerCol })
  const tr = count(robots, { r: 0, c: upperCol }, { r: lowerRow, c: W })
  const bl = count(robots, { r: upperRow, c: 0 }, { r: H, c: lowerCol })
  const br = count(robots, { r: upperRow, c: upperCol }, { r: H, c: W })

  return product([tl, tr, bl, br])
}

function draw(robots: Robot[]) {
  let rs: Map<string, boolean> = new Map()
  robots.forEach(r => rs.set(toKey(r.p), true))

  let lines = [...range(0, H)]
    .map(ir =>
      [...range(0, W)]
        .map(ic => {
          const p = rs.get(toKey({ r: ir, c: ic }))
          return p ? '#' : '.'
        })
        .join('')
    )
    .join('\n')
  console.log(lines)
}

function lowEntropy(robots: Robot[], n: number): boolean {
  let rs: Map<string, boolean> = new Map()
  robots.forEach(r => rs.set(toKey(r.p), true))

  const check = (from: Position): boolean => {
    for (const p of range(0, n)) {
      if (!rs.has(toKey(from))) {
        return false
      }
      from = step(from, { h: 0, v: 1 })
    }
    return true
  }

  for (const irow of range(0, W)) {
    for (const icol of range(0, H)) {
      if (rs.has(toKey({ r: irow, c: icol })) && check({ r: irow, c: icol })) {
        return true
      }
    }
  }
  return false
}

export function partTwo(input: Input) {
  let seconds = 0
  let robots = [...input]
  while (!lowEntropy(robots, 7)) {
    robots = robots.map(move)
    seconds += 1
  }
  draw(robots) // just for fun
  return seconds
}
