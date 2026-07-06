'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getFingerprint } from '@/lib/fingerprint'
import HomeScreen from '@/components/HomeScreen'
import ScratchCard from '@/components/ScratchCard'
import ResultWin from '@/components/ResultWin'
import ResultLose from '@/components/ResultLose'
import AlreadyPlayed from '@/components/AlreadyPlayed'

type AppState =
  | 'loading'
  | 'ready'
  | 'scratching'
  | 'win'
  | 'lose'
  | 'already_played'
  | 'inactive'
  | 'error'

interface PlayResult {
  status: string
  resultado?: 'ganador' | 'perdedor'
  codigo?: string | null
  proxima_vez?: string
}

export default function RaspaditaClient() {
  const [vista, setVista] = useState<'inicio' | 'juego'>('inicio')
  const [appState, setAppState] = useState<AppState>('loading')
  const [playResult, setPlayResult] = useState<PlayResult | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  function handleStart() {
    if (isPlaying) return
    setVista('juego')
    handlePlay()
  }

  async function handlePlay() {
    if (isPlaying) return
    setIsPlaying(true)
    setAppState('loading')
    try {
      const fp = await getFingerprint()
      const res = await fetch('/api/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint: fp }),
      })
      const data: PlayResult = await res.json()

      if (data.status === 'already_played') {
        setPlayResult(data)
        setAppState('already_played')
      } else if (data.status === 'inactive') {
        setAppState('inactive')
      } else if (data.status === 'ok') {
        setPlayResult(data)
        setAppState('scratching')
      } else {
        setAppState('error')
      }
    } catch {
      setAppState('error')
    }
  }

  function handleReveal() {
    if (!playResult) return
    setAppState(playResult.resultado === 'ganador' ? 'win' : 'lose')
  }

  if (vista === 'inicio') {
    return <HomeScreen onPlay={handleStart} isPlaying={isPlaying} />
  }

  return (
    <div className="h-dvh flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#1a0030] via-[#2d0057] to-[#1a0030] px-4 py-2 text-white">
      {/* Header — logo con resplandor */}
      <header className="w-full max-w-sm flex flex-col items-center gap-1 shrink-0 pt-1">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#9b59b6] blur-2xl opacity-70 scale-110" />
          <Image
            src="/logo.jpg"
            alt="GNC Caseros"
            width={150}
            height={137}
            className="relative object-contain rounded-full ring-2 ring-violet-400/60"
            priority
          />
        </div>
        <h1 className="text-4xl font-extrabold text-center leading-tight">
          <span className="text-white">GNC </span>
          <span className="bg-gradient-to-r from-[#d8b4fe] to-[#a855f7] bg-clip-text text-transparent">
            Caseros
          </span>
        </h1>
        <p className="text-lg italic text-violet-300 text-center -mt-1">Tu mejor opción</p>
        <div className="h-1 w-20 rounded-full bg-gradient-to-r from-[#c026d3] to-[#7c3aed] mt-1" />
      </header>

      {/* Main content */}
      <main className="w-full max-w-sm flex flex-col items-center justify-center gap-3 flex-1 min-h-0 overflow-hidden">
        {appState === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-violet-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-violet-200">Cargando...</p>
          </div>
        )}

        {appState === 'scratching' && playResult && (
          <div className="flex flex-col items-center gap-2 w-full animate-fade-in">
            <p className="text-base font-semibold text-white text-center">
              ¡Raspá para descubrir tu premio!
            </p>
            <ScratchCard
              resultado={playResult.resultado!}
              codigo={playResult.codigo}
              onReveal={handleReveal}
            />
          </div>
        )}

        {appState === 'win' && playResult?.codigo && (
          <ResultWin codigo={playResult.codigo} />
        )}

        {appState === 'lose' && <ResultLose />}

        {appState === 'already_played' && <AlreadyPlayed proximaVez={playResult?.proxima_vez} />}

        {appState === 'inactive' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-6xl">🔧</div>
            <p className="text-violet-100 text-xl font-semibold">La promoción no está activa en este momento.</p>
          </div>
        )}

        {appState === 'error' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-6xl">⚠️</div>
            <p className="text-violet-100 text-xl font-semibold">Algo salió mal. Intentá de nuevo.</p>
            <button
              onClick={() => { setIsPlaying(false); handlePlay() }}
              className="rounded-full bg-gradient-to-r from-[#c026d3] to-[#7c3aed] px-8 py-3 text-white font-bold shadow-lg shadow-fuchsia-600/40 active:scale-95 transition-all"
            >
              Reintentar
            </button>
          </div>
        )}
      </main>

      <footer className="text-[11px] text-violet-300/70 text-center shrink-0">
        GNC Caseros &mdash; Promoción válida sujeta a disponibilidad
      </footer>
    </div>
  )
}
