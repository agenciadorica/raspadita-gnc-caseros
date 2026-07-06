'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface ScratchCardProps {
  resultado: 'ganador' | 'perdedor'
  codigo?: string | null
  onReveal?: () => void
}

export default function ScratchCard({ resultado, codigo, onReveal }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isScratching = useRef(false)
  const [revealed, setRevealed] = useState(false)
  const [revealPercent, setRevealPercent] = useState(0)
  const onRevealCalled = useRef(false)

  const getPos = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const calcRevealPercent = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')!
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparent = 0
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) transparent++
    }
    return (transparent / (canvas.width * canvas.height)) * 100
  }, [])

  const scratch = useCallback(
    (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
      if (!isScratching.current) return
      e.preventDefault()
      const ctx = canvas.getContext('2d')!
      const { x, y } = getPos(e, canvas)
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, 28, 0, Math.PI * 2)
      ctx.fill()

      const pct = calcRevealPercent(canvas)
      setRevealPercent(pct)
      if (pct >= 60 && !onRevealCalled.current) {
        onRevealCalled.current = true
        setRevealed(true)
        // Clear entire overlay
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        onReveal?.()
      }
    },
    [calcRevealPercent, onReveal]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    // Draw scratch overlay
    ctx.globalCompositeOperation = 'source-over'
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grad.addColorStop(0, '#9ca3af')
    grad.addColorStop(0.5, '#d1d5db')
    grad.addColorStop(1, '#9ca3af')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#6b7280'
    ctx.font = 'bold 25px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('¡RASPÁ AQUÍ!', canvas.width / 2, canvas.height / 2 - 12)
    ctx.font = '19px Arial'
    ctx.fillText('Deslizá el dedo', canvas.width / 2, canvas.height / 2 + 18)

    const handleStart = () => { isScratching.current = true }
    const handleEnd = () => { isScratching.current = false }
    const handleMove = (e: MouseEvent | TouchEvent) => scratch(e, canvas)

    canvas.addEventListener('mousedown', handleStart)
    canvas.addEventListener('mouseup', handleEnd)
    canvas.addEventListener('mousemove', handleMove)
    canvas.addEventListener('touchstart', handleStart, { passive: false })
    canvas.addEventListener('touchend', handleEnd)
    canvas.addEventListener('touchmove', handleMove, { passive: false })

    return () => {
      canvas.removeEventListener('mousedown', handleStart)
      canvas.removeEventListener('mouseup', handleEnd)
      canvas.removeEventListener('mousemove', handleMove)
      canvas.removeEventListener('touchstart', handleStart)
      canvas.removeEventListener('touchend', handleEnd)
      canvas.removeEventListener('touchmove', handleMove)
    }
  }, [scratch])

  return (
    <div className="relative w-full max-w-[260px] mx-auto select-none">
      {/* Prize content underneath */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl transition-opacity duration-500 ${
          resultado === 'ganador'
            ? 'bg-gradient-to-br from-brand-primary to-violet-700'
            : 'bg-gradient-to-br from-gray-700 to-black'
        }`}
        style={{ minHeight: 340 }}
      >
        {resultado === 'ganador' ? (
          <>
            <span className="text-5xl mb-2">🏆</span>
            <p className="text-[#FFD700] font-extrabold text-xl text-center px-4">¡GANASTE!</p>
            {codigo && (
              <p className="text-[#FFD700] font-mono text-3xl font-black mt-2 tracking-widest">{codigo}</p>
            )}
          </>
        ) : (
          <>
            <span className="text-5xl mb-2">😔</span>
            <p className="text-white font-bold text-lg text-center px-4">¡Suerte la próxima!</p>
          </>
        )}
      </div>

      {/* Scratch overlay canvas */}
      <canvas
        ref={canvasRef}
        width={260}
        height={340}
        className={`relative w-full rounded-2xl cursor-crosshair touch-none ${revealed ? 'opacity-0 pointer-events-none' : ''}`}
        style={{ display: 'block', minHeight: 340 }}
      />
    </div>
  )
}
