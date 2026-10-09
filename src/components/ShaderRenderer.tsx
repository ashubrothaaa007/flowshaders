import { memo } from "react"
import {
  Dithering,
  GrainGradient,
  Metaballs,
  NeuroNoise,
  SimplexNoise,
  SmokeRing,
  Swirl,
  Warp,
} from "@paper-design/shaders-react"
import type { ColorPalette, PhysicsState, ShaderId } from "../types"

interface ShaderRendererProps {
  id: ShaderId
  palette: ColorPalette
  physics?: PhysicsState
  distortion?: number
  swirl?: number
  speed?: number
  isCard?: boolean
}

const SHADER_SPEED_FACTORS: Record<ShaderId, number> = {
  warp: 4.8,
  grain: 3.6,
  simplex: 2.8,
  metaballs: 2.5,
  dithering: 1.4,
  neuro: 1.3,
  swirl: 1.0,
  smoke: 0.95,
}

export const ShaderRenderer = memo(function ShaderRenderer({
  id,
  palette,
  physics = { x: 0, y: 0, speed: 0, impulse: 0, pulseTime: 0 },
  distortion = 0.25,
  swirl = 0.3,
  speed = 1.0,
  isCard = false,
}: ShaderRendererProps) {
  const dynamicDistortion = Math.min(
    distortion + physics.speed * 0.25 + physics.impulse * 0.45,
    1.0,
  )
  const dynamicSwirl = Math.min(
    swirl + physics.speed * 0.25 + physics.impulse * 0.4,
    1.0,
  )
  const speedFactor = SHADER_SPEED_FACTORS[id] ?? 1.0
  const dynamicSpeed = isCard
    ? (speed ?? 1.0) * speedFactor
    : (speed + physics.speed * 0.3 + physics.impulse * 0.6) * speedFactor

  const commonProps = {
    width: "100%",
    height: "100%",
    style: { width: "100%", height: "100%", display: "block" },
    minPixelRatio: 1,
    maxPixelCount: isCard ? 640 * 480 : 1920 * 1080,
    webGlContextAttributes: { preserveDrawingBuffer: true },
  }

  switch (id) {
    case "dithering":
      return (
        <Dithering
          {...commonProps}
          colorBack={palette.background}
          colorFront={palette.accent}
          shape="warp"
          type="4x4"
          size={isCard ? 3.5 : 3.2 + physics.impulse * 3.5}
          speed={dynamicSpeed}
          scale={0.9 + physics.impulse * 0.15}
          offsetX={physics.x * 0.2}
          offsetY={physics.y * 0.2}
        />
      )

    case "neuro":
      return (
        <NeuroNoise
          {...commonProps}
          colorBack={palette.background}
          colorMid={palette.colors[2] || palette.accent}
          colorFront={palette.accent}
          brightness={
            isCard
              ? 0.5
              : Math.min(
                  0.35 + physics.impulse * 0.55 + physics.speed * 0.2,
                  1.0,
                )
          }
          contrast={0.45 + dynamicDistortion * 0.3}
          speed={dynamicSpeed}
          scale={0.9}
          offsetX={physics.x * 0.25}
          offsetY={physics.y * 0.25}
        />
      )

    case "grain":
      return (
        <GrainGradient
          {...commonProps}
          colorBack={palette.background}
          colors={palette.colors}
          softness={0.45}
          intensity={dynamicDistortion}
          noise={0.35 + physics.impulse * 0.3}
          shape="wave"
          speed={dynamicSpeed}
          offsetX={physics.x * 0.2}
          offsetY={physics.y * 0.2}
        />
      )

    case "metaballs":
      return (
        <Metaballs
          {...commonProps}
          colorBack={palette.background}
          colors={palette.colors}
          count={isCard ? 8 : Math.min(Math.round(6 + physics.impulse * 8), 16)}
          size={0.45 + physics.impulse * 0.2}
          speed={dynamicSpeed}
          scale={0.95}
          offsetX={physics.x * 0.2}
          offsetY={physics.y * 0.2}
        />
      )

    case "smoke":
      return (
        <SmokeRing
          {...commonProps}
          colorBack={palette.background}
          colors={palette.colors}
          thickness={0.5}
          radius={0.35}
          noiseIterations={4}
          speed={dynamicSpeed}
          scale={0.9}
          offsetX={physics.x * 0.2}
          offsetY={physics.y * 0.2}
        />
      )

    case "swirl":
      return (
        <Swirl
          {...commonProps}
          colorBack={palette.background}
          colors={palette.colors}
          bandCount={8}
          twist={0.4 + dynamicSwirl * 0.5}
          speed={dynamicSpeed}
          scale={0.9}
          offsetX={physics.x * 0.2}
          offsetY={physics.y * 0.2}
        />
      )

    case "simplex":
      return (
        <SimplexNoise
          {...commonProps}
          colors={palette.colors}
          stepsPerColor={2}
          softness={0.45 + dynamicDistortion * 0.3}
          speed={dynamicSpeed}
          scale={0.95}
          rotation={physics.x * 20}
          offsetX={physics.x * 0.2}
          offsetY={physics.y * 0.2}
        />
      )

    case "warp":
    default:
      return (
        <Warp
          {...commonProps}
          colors={palette.colors}
          proportion={0.32 + physics.x * 0.1}
          softness={0.35}
          distortion={dynamicDistortion}
          swirl={dynamicSwirl}
          swirlIterations={
            isCard ? 4 : Math.min(Math.round(3 + physics.impulse * 6), 14)
          }
          speed={dynamicSpeed}
          shape="stripes"
          shapeScale={0.55}
          offsetX={physics.x * 0.18}
          offsetY={physics.y * 0.18}
          rotation={physics.x * 20}
        />
      )
  }
})
