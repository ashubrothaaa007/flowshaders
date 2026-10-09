import type { ShaderCardDef } from "../types"

export const SHADER_CARDS: ShaderCardDef[] = [
  {
    id: "warp",
    name: "Warp",
    label: "liquid warp",
    category: "generative",
    description:
      "Animated color fields warped by noise, swirls, and organic distortion.",
    defaultPaletteId: "obsidian",
  },
  {
    id: "dithering",
    name: "Dithering",
    label: "matrix dithering",
    category: "generative",
    description:
      "Retro 2-color Bayer matrix dithering over dynamic fluid fields.",
    defaultPaletteId: "acid",
  },
  {
    id: "neuro",
    name: "Neuro Noise",
    label: "neuro noise",
    category: "generative",
    description:
      "Luminous web of fluid neural filaments and glowing intersections.",
    defaultPaletteId: "cyberpunk",
  },
  {
    id: "grain",
    name: "Grain Gradient",
    label: "grain gradient",
    category: "generative",
    description:
      "Chromatic noise-textured gradients with tactile physical grain.",
    defaultPaletteId: "solstice",
  },
  {
    id: "metaballs",
    name: "Metaballs",
    label: "organic metaballs",
    category: "generative",
    description:
      "Fluid gooey particles floating, interacting, and merging organically.",
    defaultPaletteId: "eucalyptus",
  },
  {
    id: "smoke",
    name: "Smoke Ring",
    label: "smoke ring",
    category: "generative",
    description:
      "Layered noise vortex with billowing smoky atmospheric filaments.",
    defaultPaletteId: "obsidian",
  },
  {
    id: "swirl",
    name: "Swirl",
    label: "vortex swirl",
    category: "generative",
    description:
      "Deep vortex swirls bending color ribbons in mesmerizing circular arcs.",
    defaultPaletteId: "cyberpunk",
  },
  {
    id: "simplex",
    name: "Simplex Noise",
    label: "simplex flow",
    category: "generative",
    description:
      "Multi-color simplex noise mapped into ultra-smooth fluid bands.",
    defaultPaletteId: "solstice",
  },
]
