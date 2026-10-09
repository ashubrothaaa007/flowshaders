import { useCallback, useEffect, useRef, useState } from "react"
import { synth } from "../lib/audio/synth"
import type { PhysicsState } from "../types"

export type { PhysicsState }

export function useShaderPhysics() {
  const [physics, setPhysics] = useState<PhysicsState>({
    x: 0,
    y: 0,
    speed: 0,
    impulse: 0,
    pulseTime: 0,
  })

  const target = useRef({ x: 0, y: 0, velocity: 0, impulse: 0 })
  const current = useRef({ x: 0, y: 0, velocity: 0, impulse: 0 })
  const lastPointer = useRef({ x: 0, y: 0, time: 0 })
  const rafId = useRef<number | null>(null)

  const triggerPulse = useCallback((intensity = 0.8) => {
    target.current.impulse = Math.min(target.current.impulse + intensity, 1.6)
    synth.playPulse(intensity)
  }, [])

  useEffect(() => {
    let lastFrame = performance.now()

    const loop = (now: number) => {
      const dt = Math.min((now - lastFrame) / 1000, 0.1)
      lastFrame = now

      // Spring follow for coordinates
      const followRate = 1 - Math.exp(-dt * 8)
      current.current.x += (target.current.x - current.current.x) * followRate
      current.current.y += (target.current.y - current.current.y) * followRate

      // Decay velocity and impulse
      target.current.velocity *= Math.exp(-dt * 4)
      current.current.velocity +=
        (target.current.velocity - current.current.velocity) * followRate

      target.current.impulse *= Math.exp(-dt * 2.8)
      current.current.impulse +=
        (target.current.impulse - current.current.impulse) *
        (1 - Math.exp(-dt * 12))

      setPhysics({
        x: current.current.x,
        y: current.current.y,
        speed: current.current.velocity,
        impulse: current.current.impulse,
        pulseTime: now * 0.001,
      })

      rafId.current = requestAnimationFrame(loop)
    }

    rafId.current = requestAnimationFrame(loop)

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height

      target.current.x = (px - 0.5) * 2
      target.current.y = (py - 0.5) * 2

      const now = performance.now()
      const dt = (now - lastPointer.current.time) / 1000
      if (dt > 0.01 && dt < 0.25) {
        const dist = Math.hypot(
          e.clientX - lastPointer.current.x,
          e.clientY - lastPointer.current.y,
        )
        const v = dist / dt / 1400
        target.current.velocity = Math.min(v, 2.5)
        synth.playMotion(target.current.velocity)
      }

      lastPointer.current = { x: e.clientX, y: e.clientY, time: now }
    },
    [],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      handlePointerMove(e)
      triggerPulse(1.0)
    },
    [handlePointerMove, triggerPulse],
  )

  return {
    physics,
    triggerPulse,
    handlePointerMove,
    handlePointerDown,
  }
}
