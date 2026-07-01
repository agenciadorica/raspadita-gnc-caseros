'use client'

import { useEffect, useRef } from 'react'

interface ResultWinProps {
  codigo: string
}

const COLORS = ['#5B2D8E', '#FFD700', '#FFFFFF']

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  alpha: number
  size: number
}

export default function ResultWin({ codigo }: ResultWinProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    let particles: Particle[] = []
    let lastBurst = 0
    let rafId = 0

    function spawnBurst() {
      // Ráfagas cerca de los bordes superiores para no tapar el código
      const x = Math.random() < 0.5 ? Math.random() * width * 0.3 : width - Math.random() * width * 0.3
      const y = Math.random() * height * 0.45
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const count = 22 + Math.floor(Math.random() * 10)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count
        const speed = 1.2 + Math.random() * 2
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          size: 2 + Math.random() * 1.5,
        })
      }
    }

    function frame(time: number) {
      ctx!.clearRect(0, 0, width, height)

      if (time - lastBurst > 650) {
        spawnBurst()
        lastBurst = time
      }

      particles = particles.filter((p) => p.alpha > 0.02)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.03
        p.vx *= 0.99
        p.alpha *= 0.955
        ctx!.globalAlpha = p.alpha
        ctx!.fillStyle = p.color
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.globalAlpha = 1

      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative w-full flex flex-col items-center justify-center gap-4 py-4 px-4 text-center animate-fade-in overflow-hidden rounded-2xl">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="text-6xl">🏆</div>
        <h2 className="text-2xl font-extrabold text-brand-primary leading-snug">
          ¡Ganaste! La carga que acabás de hacer es gratis.
        </h2>
        <p className="text-gray-600 text-base">Mostrá este código al playero:</p>
        <div className="bg-violet-50 border-4 border-brand-primary rounded-2xl px-8 py-5 shadow-lg">
          <span className="font-mono text-4xl font-black text-brand-primary tracking-widest">{codigo}</span>
        </div>
      </div>
    </div>
  )
}
