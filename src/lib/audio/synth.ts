class AudioSynth {
  private ctx: AudioContext | null = null
  private enabled = true
  private readonly scale = [220, 247, 277, 330, 370, 440, 494, 554, 659]

  toggleSound(): boolean {
    this.enabled = !this.enabled
    return this.enabled
  }

  isSoundEnabled(): boolean {
    return this.enabled
  }

  playPulse(intensity = 0.5): void {
    if (!this.enabled || typeof window === "undefined") return

    try {
      if (!this.ctx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        this.ctx = new AudioContextClass()
      }

      if (this.ctx.state === "suspended") {
        this.ctx.resume()
      }

      const noteIndex = Math.floor(Math.random() * this.scale.length)
      const freq = this.scale[noteIndex]

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

      const volume = Math.min(Math.max(intensity * 0.15, 0.04), 0.25)
      gain.gain.setValueAtTime(volume, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.5)
    } catch {
      // AudioContext policy safe fallback
    }
  }
}

export const synth = new AudioSynth()
