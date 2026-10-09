import { useCallback, useEffect, useState } from "react"
import { SHADER_CARDS } from "../data/shaders"
import { PALETTES } from "../data/palettes"
import { useShaderPhysics } from "../hooks/useShaderPhysics"
import { synth } from "../lib/audio/synth"
import type { ColorPalette, ShaderId } from "../types"
import CursorFollower from "./CursorFollower"
import { ShaderRenderer } from "./ShaderRenderer"

interface FullscreenToyProps {
  initialShaderId: ShaderId
  onClose: () => void
}

export default function FullscreenToy({
  initialShaderId,
  onClose,
}: FullscreenToyProps) {
  const currentCard =
    SHADER_CARDS.find((c) => c.id === initialShaderId) || SHADER_CARDS[0]

  const [palette, setPalette] = useState<ColorPalette>(() => {
    return (
      PALETTES.find((p) => p.id === currentCard.defaultPaletteId) || PALETTES[0]
    )
  })

  const [distortion, setDistortion] = useState(0.2)
  const [swirl, setSwirl] = useState(0.25)
  const [speed, setSpeed] = useState(0.2)
  const [soundOn, setSoundOn] = useState(synth.isSoundEnabled())
  const [expanded, setExpanded] = useState(false)
  const [snapshotToast, setSnapshotToast] = useState(false)

  const { physics, triggerPulse, handlePointerMove, handlePointerDown } =
    useShaderPhysics()

  const handleSnapshot = useCallback(() => {
    const canvas = document.querySelector(
      ".fullscreen-shader-surface canvas",
    ) as HTMLCanvasElement | null
    if (!canvas) return

    try {
      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `flow-${currentCard.id}-${Date.now()}.png`
      link.click()

      triggerPulse(0.8)
      if (soundOn) synth.playPulse(0.8)
      setSnapshotToast(true)
      setTimeout(() => setSnapshotToast(false), 2200)
    } catch (err) {
      console.error("Failed to capture snapshot:", err)
    }
  }, [currentCard.id, triggerPulse, soundOn])

  const handleRandomize = useCallback(() => {
    const nextPalette = PALETTES[Math.floor(Math.random() * PALETTES.length)]
    setPalette(nextPalette)
    setDistortion(parseFloat((0.08 + Math.random() * 0.45).toFixed(2)))
    setSwirl(parseFloat((0.1 + Math.random() * 0.5).toFixed(2)))
    setSpeed(parseFloat((0.1 + Math.random() * 0.35).toFixed(2)))
    triggerPulse(1.2)
  }, [triggerPulse])

  const handleReset = useCallback(() => {
    setDistortion(0.2)
    setSwirl(0.25)
    setSpeed(0.2)
    const defPalette =
      PALETTES.find((p) => p.id === currentCard.defaultPaletteId) || PALETTES[0]
    setPalette(defPalette)
    triggerPulse(0.5)
  }, [triggerPulse, currentCard.defaultPaletteId])

  const handleSoundToggle = () => {
    const next = synth.toggleSound()
    setSoundOn(next)
    if (next) synth.playPulse(0.5)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.code === "Space") {
        e.preventDefault()
        triggerPulse(1.1)
      } else if (e.key === "r" || e.key === "R") {
        handleRandomize()
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault()
        handleSnapshot()
      } else if (e.key === "c" || e.key === "C") {
        setPalette((curr) => {
          const idx = PALETTES.findIndex((p) => p.id === curr.id)
          return PALETTES[(idx + 1) % PALETTES.length]
        })
        triggerPulse(0.6)
      } else if (e.key === "m" || e.key === "M") {
        handleSoundToggle()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    onClose,
    triggerPulse,
    handleRandomize,
    handleSnapshot,
    handleSoundToggle,
  ])

  return (
    <div className="fullscreen-toy-overlay">
      {/* Interactive WebGL Shader Canvas Surface */}
      <div
        className="fullscreen-shader-surface"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        aria-label={`Interactive ${currentCard.name} Canvas`}
      >
        <ShaderRenderer
          id={initialShaderId}
          palette={palette}
          physics={physics}
          distortion={distortion}
          swirl={swirl}
          speed={speed}
        />
      </div>

      {/* Top Header */}
      <header className="toy-top-bar">
        <div className="left-controls">
          <button
            type="button"
            className="toy-btn"
            onClick={onClose}
            title="Back to gallery (Esc)"
            aria-label="Back to gallery"
          >
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                d="M10 12L6 8l4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Gallery</span>
            <span className="btn-shortcut">Esc</span>
          </button>

          <div className="toy-badge">
            <span className="badge-name">{currentCard.name}</span>
          </div>
        </div>

        <div className="right-controls">
          <button
            type="button"
            className="toy-btn"
            onClick={handleSoundToggle}
            title={soundOn ? "Mute audio (M)" : "Unmute audio (M)"}
            aria-label={soundOn ? "Mute audio" : "Unmute audio"}
          >
            {soundOn ? (
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M7 3L3.5 6H1v4h2.5L7 13V3z" />
                <path d="M10.5 5.5a3.5 3.5 0 010 5" />
                <path d="M12.5 3.5a6.5 6.5 0 010 9" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M7 3L3.5 6H1v4h2.5L7 13V3z" />
                <path d="M11 6l4 4M15 6l-4 4" />
              </svg>
            )}
            <span>{soundOn ? "Sound" : "Muted"}</span>
          </button>

          <button
            type="button"
            className="toy-btn"
            onClick={handleSnapshot}
            title="Save PNG artwork (S)"
            aria-label="Save PNG artwork"
          >
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2" y="3" width="12" height="10" rx="2" />
              <circle cx="8" cy="8" r="2.2" />
              <path d="M5.5 3V2h2v1" />
            </svg>
            <span>Snapshot</span>
            <span className="btn-shortcut">S</span>
          </button>

          <button
            type="button"
            className="toy-btn"
            onClick={handleReset}
            title="Reset parameters"
            aria-label="Reset parameters"
          >
            <svg
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M12.7 5.4A5.1 5.1 0 1 0 13 9M12.7 2.3v3.3H9.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Snapshot Confirmation Toast */}
      {snapshotToast && (
        <div className="snapshot-toast" role="status" aria-live="polite">
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M3 8.5l3.5 3.5 6.5-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Artwork saved as PNG</span>
        </div>
      )}

      {/* Floating Bottom Tuning Dock */}
      <aside className="toy-dock" aria-label="Interactive shader controls">
        <div className="dock-bar">
          <div className="dock-meta">
            <span className="dock-title">{currentCard.name}</span>
            <span className="dock-tag">{palette.name.split(" ")[0]}</span>
          </div>

          <div className="dock-actions">
            <button
              type="button"
              className="dock-btn dock-btn-primary"
              onClick={() => triggerPulse(1.1)}
              title="Trigger elastic shockwave (Space)"
            >
              <svg
                viewBox="0 0 16 16"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M1 8h3l2.5-5 3.5 10 2.5-5h2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Pulse</span>
            </button>

            <button
              type="button"
              className="dock-btn"
              onClick={handleRandomize}
              title="Randomize combination (R)"
            >
              <svg
                viewBox="0 0 16 16"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M2.5 4.5h3l5 7h3M13.5 4.5h-3l-2 2.8M2.5 11.5h3l2-2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Roll</span>
            </button>

            <button
              type="button"
              className={`dock-btn ${expanded ? "is-active" : ""}`}
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              title="Tune parameters"
            >
              <svg
                viewBox="0 0 16 16"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M2 4h8M13 4h1M2 8h2M7 8h7M2 12h10M15 12h-1" />
                <circle cx="11" cy="4" r="1.5" />
                <circle cx="5" cy="8" r="1.5" />
                <circle cx="13" cy="12" r="1.5" />
              </svg>
              <span>Tune</span>
            </button>
          </div>
        </div>

        {/* Tuning Drawer */}
        {expanded && (
          <div className="dock-drawer animate-drawer">
            <div className="drawer-group">
              <span className="drawer-label">Palette</span>
              <div className="palette-strip">
                {PALETTES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`palette-chip ${
                      palette.id === p.id ? "is-selected" : ""
                    }`}
                    onClick={() => setPalette(p)}
                    title={p.name}
                  >
                    <span className="color-dots">
                      {p.colors.slice(1, 4).map((c, i) => (
                        <span
                          key={i}
                          className="dot"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </span>
                    <span className="chip-name">{p.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="drawer-sliders">
              <label className="slider-item">
                <span className="slider-header">
                  <span>Distortion</span>
                  <span className="slider-val">
                    {Math.round(distortion * 100)}%
                  </span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.02"
                  value={distortion}
                  onChange={(e) => setDistortion(parseFloat(e.target.value))}
                />
              </label>

              <label className="slider-item">
                <span className="slider-header">
                  <span>Swirl</span>
                  <span className="slider-val">{Math.round(swirl * 100)}%</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.02"
                  value={swirl}
                  onChange={(e) => setSwirl(parseFloat(e.target.value))}
                />
              </label>

              <label className="slider-item">
                <span className="slider-header">
                  <span>Speed</span>
                  <span className="slider-val">{speed.toFixed(2)}x</span>
                </span>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.02"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                />
              </label>
            </div>
          </div>
        )}
      </aside>

      {/* Interactive Cursor Follower */}
      <CursorFollower impulse={physics.impulse} />
    </div>
  )
}
