import { useEffect, useRef } from "react"

interface CursorFollowerProps {
  impulse: number
}

export default function CursorFollower({ impulse }: CursorFollowerProps) {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!cursorRef.current || e.pointerType !== "mouse") return
      cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      cursorRef.current.style.opacity = "1"
    }

    const handleLeave = () => {
      if (!cursorRef.current) return
      cursorRef.current.style.opacity = "0"
    }

    window.addEventListener("pointermove", handleMove)
    document.addEventListener("pointerleave", handleLeave)

    return () => {
      window.removeEventListener("pointermove", handleMove)
      document.removeEventListener("pointerleave", handleLeave)
    }
  }, [])

  return (
    <div ref={cursorRef} className="interactive-cursor" aria-hidden="true">
      <span className="cursor-dot" />
      <span
        className="cursor-halo"
        style={{
          transform: `scale(${1 + impulse * 1.8})`,
          opacity: 0.2 + impulse * 0.6,
        }}
      />
    </div>
  )
}
