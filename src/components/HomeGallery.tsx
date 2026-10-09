import { useState } from "react"
import { SHADER_CARDS } from "../data/shaders"
import { PALETTES } from "../data/palettes"
import type { ColorPalette, ShaderCardDef, ShaderId } from "../types"
import { ShaderRenderer } from "./ShaderRenderer"

interface ShaderCardProps {
  card: ShaderCardDef
  palette: ColorPalette
  onSelect: () => void
}

function ShaderCard({ card, palette, onSelect }: ShaderCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="shader-card-wrapper"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      aria-label={card.name}
    >
      <div className="shader-card-frame">
        <div className="shader-canvas-container">
          <ShaderRenderer
            id={card.id}
            palette={palette}
            isCard
            speed={isHovered ? 1.35 : 1.0}
          />
        </div>
      </div>

      <div className="card-label-block">
        <span className="card-label">{card.label}</span>
      </div>
    </div>
  )
}

interface HomeGalleryProps {
  onSelectShader: (id: ShaderId) => void
}

export default function HomeGallery({ onSelectShader }: HomeGalleryProps) {
  return (
    <div className="gallery-page">
      <header className="gallery-nav">
        <a href="/" className="flow-brand-link" aria-label="FLOW Home">
          <span className="brand-wordmark">
            FLOW<span className="wordmark-dot">.</span>
          </span>
        </a>

        <div className="nav-actions">
          <a
            href="https://github.com/ashubrothaaa007/flowshaders"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-social-link"
            aria-label="View on GitHub"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <a
            href="https://lnkd.in/p/g56xCeZ5"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-social-link nav-linkedin-link"
            aria-label="View on LinkedIn"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>
        </div>
      </header>

      <section className="gallery-hero">
        <h1 className="hero-title">
          flow shaders<span className="hero-dot">.</span>
        </h1>
        <p className="hero-subtitle">
          a small interactive visual toy built using Paper Shaders.
          <br />
          Move. Disturb. Leave a trace.
        </p>
      </section>

      <section className="cards-section" aria-label="FLOW visual shaders">
        <div className="section-header">
          <h2 className="section-title">interactive shaders</h2>
        </div>

        <div className="shaders-grid">
          {SHADER_CARDS.map((card) => {
            const palette =
              PALETTES.find((p) => p.id === card.defaultPaletteId) ||
              PALETTES[0]

            return (
              <ShaderCard
                key={card.id}
                card={card}
                palette={palette}
                onSelect={() => onSelectShader(card.id)}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}
