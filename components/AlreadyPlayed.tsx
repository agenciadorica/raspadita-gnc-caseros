'use client'

import { useEffect, useState } from 'react'

interface AlreadyPlayedProps {
  proximaVez?: string
}

function formatFalta(proximaVez?: string): string | null {
  if (!proximaVez) return null
  const diffMs = new Date(proximaVez).getTime() - Date.now()
  if (diffMs <= 0) return null
  const totalMin = Math.ceil(diffMs / 60000)
  const horas = Math.floor(totalMin / 60)
  const minutos = totalMin % 60
  const partes: string[] = []
  if (horas > 0) partes.push(`${horas} ${horas === 1 ? 'hora' : 'horas'}`)
  partes.push(`${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`)
  return partes.join(' ')
}

export default function AlreadyPlayed({ proximaVez }: AlreadyPlayedProps) {
  const [falta, setFalta] = useState<string | null>(() => formatFalta(proximaVez))

  useEffect(() => {
    setFalta(formatFalta(proximaVez))
    const interval = setInterval(() => setFalta(formatFalta(proximaVez)), 30000)
    return () => clearInterval(interval)
  }, [proximaVez])

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 px-4 text-center">
      <div className="text-7xl">⏰</div>
      <h2 className="text-3xl font-extrabold text-gray-700">Ya participaste.</h2>
      {falta ? (
        <p className="text-gray-500 text-xl">
          Podés volver a jugar en <span className="font-bold text-brand-primary">{falta}</span>.
        </p>
      ) : (
        <p className="text-gray-500 text-xl">¡Te esperamos en tu próxima carga!</p>
      )}
    </div>
  )
}
