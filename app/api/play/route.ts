import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { fingerprint } = body

  if (!fingerprint || typeof fingerprint !== 'string') {
    return Response.json({ error: 'fingerprint requerido' }, { status: 400 })
  }

  const db = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  // Check if device already played today
  const { data: existing } = await db
    .from('jugadas')
    .select('id, gano, codigo_premio')
    .eq('fingerprint', fingerprint)
    .eq('fecha', today)
    .maybeSingle()

  if (existing) {
    return Response.json({ status: 'already_played' })
  }

  // Get config
  const { data: config } = await db
    .from('config')
    .select('premios_por_dia, activo')
    .eq('id', 1)
    .single()

  if (!config?.activo) {
    return Response.json({ status: 'inactive' })
  }

  // Count prizes given today
  const { count: premiosHoy } = await db
    .from('jugadas')
    .select('*', { count: 'exact', head: true })
    .eq('fecha', today)
    .eq('gano', true)

  const premiosRestantes = config.premios_por_dia - (premiosHoy ?? 0)

  if (premiosRestantes <= 0) {
    return Response.json({ status: 'limit_reached' })
  }

  // Progressive probability: increases as day goes on
  const now = new Date()
  const horaActual = now.getHours() + now.getMinutes() / 60
  const horasCierre = 22
  const horasApertura = 8
  const horasTotales = horasCierre - horasApertura
  const horasTranscurridas = Math.max(0, horaActual - horasApertura)
  const fraccionDia = Math.min(1, horasTranscurridas / horasTotales)

  // Estimate remaining plays: assume ~50 plays per day, adjust by time
  const jugadasEstimadas = Math.max(premiosRestantes, Math.round(50 * (1 - fraccionDia)))
  const probabilidad = Math.min(0.95, premiosRestantes / jugadasEstimadas)

  const gano = Math.random() < probabilidad
  const codigoPremio = gano ? generateCode() : null

  const { error } = await db.from('jugadas').insert({
    fingerprint,
    fecha: today,
    gano,
    codigo_premio: codigoPremio,
  })

  if (error) {
    return Response.json({ error: 'error interno' }, { status: 500 })
  }

  return Response.json({
    status: 'ok',
    resultado: gano ? 'ganador' : 'perdedor',
    codigo: codigoPremio,
  })
}
