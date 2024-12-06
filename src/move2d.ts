export interface Position {
  r: number
  c: number
}

export interface Facing {
  h: number
  v: number
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
