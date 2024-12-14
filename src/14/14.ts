import { lines, mod, product, range } from '../advent'
import { Position, toKey } from '@/move2d'

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
// const W = 11
// const H = 7

function move(robot: Robot): Robot {
  return {
    vx: robot.vx,
    vy: robot.vy,
    p: { r: mod(robot.p.r + robot.vy, H), c: mod(robot.p.c + robot.vx, W) }
  }
}

function inQuadrant(from: Position, to: Position, robot: Robot): boolean {
  return (
    from.r <= robot.p.r &&
    robot.p.r < to.r &&
    from.c <= robot.p.c &&
    robot.p.c < to.c
  )
}

const h = (n: number): [number, number] => [Math.floor(n / 2), Math.ceil(n / 2)]

const time = (robots: Robot[], seconds: number): Robot[] => {
  let result = [...robots]
  for (const _ of range(0, seconds)) {
    result = result.map(move)
  }
  return result
}

export function partOne(input: Input) {
  const robots = time(input, 100)

  const [lhr, uhr] = h(H)
  const [lhc, uhc] = h(W)

  const tl = robots.filter(r =>
    inQuadrant({ r: 0, c: 0 }, { r: lhr, c: lhc }, r)
  ).length
  const tr = robots.filter(r =>
    inQuadrant({ r: 0, c: uhc }, { r: lhr, c: W }, r)
  ).length
  const bl = robots.filter(r =>
    inQuadrant({ r: uhr, c: 0 }, { r: H, c: lhc }, r)
  ).length
  const br = robots.filter(r =>
    inQuadrant({ r: uhr, c: uhc }, { r: H, c: W }, r)
  ).length

  return product([tl, tr, bl, br])
}

function draw(robots: Robot[]) {
  let rs: Map<string, boolean> = new Map()
  for (const ir of range(0, H)) {
    for (const ic of range(0, W)) {
      rs.set(toKey({ r: ir, c: ic }), false)
    }
  }
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

function noOverlaps(robots: Robot[]): boolean {
  let positions: Set<string> = new Set()
  robots.forEach(r => positions.add(toKey(r.p)))
  return positions.size === robots.length
}

function getNoOverlaps(robots: Robot[]): Array<[Robot[], number]> {
  let current = [...robots]
  let seconds = 0
  let count = 10
  let result: [Robot[], number][] = []
  while (result.length < count) {
    if (noOverlaps(current)) {
      result.push([current, seconds])
    }
    current = [...current].map(r => move(r))
    seconds += 1
  }

  return result
}

export function partTwo(input: Input) {
  // const noOverlaps = getNoOverlaps(input)
  // console.log(noOverlaps.map(a => a[1]))
  const seconds = 7338
  let result = time(input, seconds)
  draw(result)
  return 0
}
