export interface Position {
  r: number
  c: number
}

export interface Facing {
  h: number
  v: number
}

interface Bounds {
  rows: number
  cols: number
}

export const getBounds = <T>(ts: T[][]): Bounds => ({
  rows: ts.length,
  cols: ts[0]?.length ?? 0
})

export const inbounds = (bounds: Bounds, position: Position): boolean => {
  return (
    0 <= position.r &&
    position.r < bounds.rows &&
    0 <= position.c &&
    position.c < bounds.cols
  )
}

export const UP: Facing = { h: 0, v: -1 }
export const DOWN: Facing = { h: 0, v: 1 }
export const LEFT: Facing = { h: -1, v: 0 }
export const RIGHT: Facing = { h: 1, v: 0 }

export const turnRight = ({ v, h }: Facing): Facing => ({
  v: h,
  h: -v
})

export const step = (position: Position, facing: Facing): Position => ({
  r: position.r + facing.v,
  c: position.c + facing.h
})

export const toKey = ({ r, c }: Position): string => `${r}-${c}`
export const fromKey = (key: string): Position => {
  const [r, c] = key.split('-')
  return { r: parseInt(r!), c: parseInt(c!) }
}

export const positionsEqual = (p1: Position, p2: Position): boolean =>
  p1.r === p2.r && p1.c === p2.c

export function neighborsViaEdge(pos: Position, bounds: Bounds): Position[] {
  return [
    { r: pos.r - 1, c: pos.c },
    { r: pos.r + 1, c: pos.c },
    { r: pos.r, c: pos.c - 1 },
    { r: pos.r, c: pos.c + 1 }
  ].filter(p => inbounds(bounds, p))
}
