import type { ColorPalette } from "../types"

export const PALETTES: ColorPalette[] = [
  {
    id: "obsidian",
    name: "Obsidian Noir",
    colors: ["#000000", "#0a0a09", "#24231f", "#6e695d", "#d6d0bf"],
    background: "#000000",
    accent: "#d6d0bf",
  },
  {
    id: "cyberpunk",
    name: "Neo Tokyo",
    colors: ["#030712", "#311042", "#7c3aed", "#06b6d4", "#f43f5e"],
    background: "#030712",
    accent: "#06b6d4",
  },
  {
    id: "solstice",
    name: "Solstice",
    colors: ["#0b0806", "#3b1207", "#9a3412", "#f97316", "#fde047"],
    background: "#0b0806",
    accent: "#f97316",
  },
  {
    id: "eucalyptus",
    name: "Eucalyptus",
    colors: ["#0a100d", "#1b2d2a", "#3f5e5a", "#6f9288", "#d8e2dc"],
    background: "#0a100d",
    accent: "#6f9288",
  },
  {
    id: "acid",
    name: "Acid Glass",
    colors: ["#050801", "#172304", "#4d7c0f", "#a3e635", "#facc15"],
    background: "#050801",
    accent: "#a3e635",
  },
]

export type { ColorPalette }
