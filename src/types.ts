export type ShaderId = "warp" | "dithering" | "neuro" | "grain" | "metaballs" | "smoke" | "swirl" | "simplex"

export interface ColorPalette {
  id: string
  name: string
  colors: string[]
  background: string
  accent: string
}

export interface ShaderCardDef {
  id: ShaderId
  name: string
  label: string
  category: string
  description: string
  defaultPaletteId: string
}

export interface PhysicsState {
  x: number
  y: number
  speed: number
  impulse: number
  pulseTime: number
}
