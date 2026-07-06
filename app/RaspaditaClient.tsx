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
    <div className="h-dvh flex flex-col items-center justify-between overflow-hidden bg-[#9ce0db] px-4 py-2">
      {/* Header */}
      <header className="w-full max-w-sm flex flex-col items-center gap-0.5 shrink-0">
        <Image
          src="/logo.jpg"
          alt="GNC Caseros"
          width={200}
          height={182}
          className="object-contain rounded-full"
          priority
        />
        <h1 className="text-4xl font-extrabold text-brand-primary text-center">GNC Caseros</h1>
        <p className="text-lg italic text-violet-300 text-center">Tu mejor opción</p>
      </header>

      {/* Main content */}
      <main className="w-full max-w-sm flex flex-col items-center justify-center gap-3 flex-1 min-h-0 overflow-hidden">
        {appState === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Cargando...</p>
          </div>
        )}

        {appState === 'scratching' && playResult && (
          <div className="flex flex-col items-center gap-2 w-full animate-fade-in">
            <p className="text-base font-semibold text-gray-700 text-center">
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
            <p className="text-gray-600 text-xl font-semibold">La promoción no está activa en este momento.</p>
          </div>
        )}

        {appState === 'error' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-6xl">⚠️</div>
            <p className="text-gray-600 text-xl font-semibold">Algo salió mal. Intentá de nuevo.</p>
            <button
              onClick={() => { setIsPlaying(false); handlePlay() }}
              className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold"
            >
              Reintentar
            </button>
          </div>
        )}
      </main>

      <footer className="text-[11px] text-gray-400 text-center shrink-0">
        GNC Caseros &mdash; Promoción válida sujeta a disponibilidad
      </footer>
    </div>
  )
}
