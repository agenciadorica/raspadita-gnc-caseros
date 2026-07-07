'use client'

import Image from 'next/image'

interface HomeScreenProps {
  onPlay: () => void
  isPlaying: boolean
}

// Monedas doradas: posición (costados/parte superior, sin tapar el logo) y timing propio
const COINS = [
  { top: '6%', left: '8%', size: 30, dur: 4.2, delay: 0, drift: '-8deg' },
  { top: '4%', left: '82%', size: 27, dur: 5.1, delay: 0.6, drift: '10deg' },
  { top: '18%', left: '3%', size: 26, dur: 4.7, delay: 1.1, drift: '-6deg' },
  { top: '16%', left: '88%', size: 32, dur: 5.6, delay: 0.3, drift: '9deg' },
  { top: '28%', left: '12%', size: 24, dur: 4.4, delay: 1.5, drift: '-11deg' },
  { top: '26%', left: '80%', size: 29, dur: 5.3, delay: 0.9, drift: '7deg' },
]

// Confeti decorativo: puntos, estrellas y líneas dispersas por el fondo
const CONFETTI = [
  { top: '12%', left: '30%', kind: 'star', color: '#FFD700', size: 14, dur: 6, delay: 0 },
  { top: '40%', left: '6%', kind: 'dot', color: '#e879f9', size: 8, dur: 5, delay: 0.8 },
  { top: '52%', left: '92%', kind: 'line', color: '#c084fc', size: 20, dur: 7, delay: 1.2 },
  { top: '66%', left: '10%', kind: 'star', color: '#ffffff', size: 12, dur: 6.5, delay: 0.4 },
  { top: '72%', left: '86%', kind: 'dot', color: '#FFD700', size: 7, dur: 5.5, delay: 1.6 },
  { top: '84%', left: '22%', kind: 'line', color: '#f0abfc', size: 18, dur: 6.2, delay: 0.2 },
  { top: '58%', left: '48%', kind: 'dot', color: '#ffffff', size: 6, dur: 5.8, delay: 2 },
  { top: '90%', left: '70%', kind: 'star', color: '#e879f9', size: 13, dur: 6.8, delay: 1 },
  { top: '46%', left: '68%', kind: 'dot', color: '#c084fc', size: 8, dur: 5.2, delay: 0.6 },
  { top: '78%', left: '52%', kind: 'line', color: '#FFD700', size: 16, dur: 7.4, delay: 1.8 },
]

export default function HomeScreen({ onPlay, isPlaying }: HomeScreenProps) {
  return (
    <div className="relative isolate h-dvh flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#1a0030] via-[#2d0057] to-[#1a0030] px-5 py-4 text-white">
      {/* Capa decorativa: confeti + monedas flotantes (detrás del contenido, sin capturar clics) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        {CONFETTI.map((c, i) => (
          <span
            key={`c-${i}`}
            className="confetti-float absolute block"
            style={
              {
                top: c.top,
                left: c.left,
                '--dur': `${c.dur}s`,
                '--rot': c.kind === 'line' ? '45deg' : '15deg',
                animationDelay: `${c.delay}s`,
              } as React.CSSProperties
            }
          >
            {c.kind === 'dot' && (
              <span
                className="block rounded-full"
                style={{ width: c.size, height: c.size, background: c.color, opacity: 0.7 }}
              />
            )}
            {c.kind === 'line' && (
              <span
                className="block rounded-full"
                style={{ width: c.size, height: 3, background: c.color, opacity: 0.6 }}
              />
            )}
            {c.kind === 'star' && (
              <svg width={c.size} height={c.size} viewBox="0 0 24 24" style={{ opacity: 0.8 }}>
                <path
                  fill={c.color}
                  d="M12 2l2.6 6.6L21.4 9l-5.2 4.6L17.9 21 12 17.3 6.1 21l1.7-7.4L2.6 9l6.8-.4z"
                />
              </svg>
            )}
          </span>
        ))}

        {COINS.map((coin, i) => (
          <span
            key={`coin-${i}`}
            className="coin-float absolute flex items-center justify-center rounded-full"
            style={
              {
                top: coin.top,
                left: coin.left,
                width: coin.size,
                height: coin.size,
                '--dur': `${coin.dur}s`,
                '--rot': coin.drift,
                animationDelay: `${coin.delay}s`,
                background:
                  'radial-gradient(circle at 32% 28%, #fff3b0 0%, #ffd700 45%, #e6a700 100%)',
                border: '2px solid #f2c200',
                boxShadow:
                  'inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(140,90,0,0.4), 0 3px 8px rgba(0,0,0,0.35)',
              } as React.CSSProperties
            }
          >
            <span
              className="font-black leading-none"
              style={{
                fontSize: coin.size * 0.5,
                color: '#8a5a00',
                textShadow: '0 1px 0 rgba(255,255,255,0.5)',
              }}
            >
              $
            </span>
          </span>
        ))}
      </div>

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
