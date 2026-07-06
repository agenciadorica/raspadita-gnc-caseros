'use client'

import Image from 'next/image'

interface HomeScreenProps {
  onPlay: () => void
  isPlaying: boolean
}

export default function HomeScreen({ onPlay, isPlaying }: HomeScreenProps) {
  return (
    <div className="h-dvh flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#1a0030] via-[#2d0057] to-[#1a0030] px-5 py-4 text-white">
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

      {/* Cuadro de descripción */}
      <section className="w-full max-w-sm flex items-center gap-3 rounded-3xl border border-violet-500/30 bg-violet-950/40 px-4 py-4 shadow-lg shadow-violet-900/40 shrink-0">
        <span className="text-5xl leading-none shrink-0" aria-hidden>⛽</span>
        <p className="text-base sm:text-lg leading-snug text-violet-50">
          <span className="font-bold text-white">¡Raspá</span> y descubrí si ganaste la carga que
          acabás de hacer,{' '}
          <span className="font-bold italic text-amber-400">gratis!</span>
        </p>
      </section>

      {/* Botón principal */}
      <button
        onClick={onPlay}
        disabled={isPlaying}
        className="w-full max-w-sm flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c026d3] to-[#7c3aed] py-4 text-xl font-extrabold text-white shadow-lg shadow-fuchsia-600/50 transition-all active:scale-95 disabled:opacity-60 shrink-0"
      >
        {isPlaying ? (
          'Preparando...'
        ) : (
          <>
            <span aria-hidden>🎁</span>
            <span>¡Jugar ahora!</span>
            <span aria-hidden className="text-white/80">›</span>
          </>
        )}
      </button>

      {/* Tres íconos de beneficios */}
      <div className="w-full max-w-sm grid grid-cols-3 gap-3 shrink-0">
        {[
          { icon: '⭐', label: 'Premios inmediatos' },
          { icon: '🛡️', label: '100% Seguro y confiable' },
          { icon: '⚡', label: 'Rápido y fácil' },
        ].map((b) => (
          <div
            key={b.label}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-violet-500/20 bg-violet-950/40 px-2 py-3 text-center"
          >
            <span className="text-2xl leading-none" aria-hidden>{b.icon}</span>
            <span className="text-[11px] leading-tight text-violet-100">{b.label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-[11px] text-violet-300/70 text-center shrink-0">
        GNC Caseros &mdash; Promoción válida sujeta a disponibilidad
      </footer>
    </div>
  )
}
