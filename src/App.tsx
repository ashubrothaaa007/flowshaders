import { useState } from "react"
import FullscreenToy from "./components/FullscreenToy"
import HomeGallery from "./components/HomeGallery"
import type { ShaderId } from "./types"

export default function App() {
  const [activeShader, setActiveShader] = useState<ShaderId | null>(null)

  if (activeShader) {
    return (
      <FullscreenToy
        initialShaderId={activeShader}
        onClose={() => setActiveShader(null)}
      />
    )
  }

  return <HomeGallery onSelectShader={(id) => setActiveShader(id)} />
}
