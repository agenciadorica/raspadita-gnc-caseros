import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getArgentinaDateString, getArgentinaHour, getFranjaActual } from '@/lib/franjas'

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
  const hoy = getArgentinaDateString()

  // 1 jugada por dispositivo cada 8 horas
  const ochoHorasMs = 8 * 60 * 60 * 1000
  const desde = new Date(Date.now() - ochoHorasMs).toISOString()
  const { data: existing } = await db
    .from('jugadas')
    .select('created_at')
    .eq('fingerprint', fingerprint)
    .gte('created_at', desde)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing) {
    const proximaVez = new Date(new Date(existing.created_at).getTime() + ochoHorasMs).toISOString()
    return Response.json({ status: 'already_played', proxima_vez: proximaVez })
  }

  const { data: config } = await db
    .from('config')
    .select('activo')
    .eq('id', 1)
    .single()

  if (!config?.activo) {
    return Response.json({ status: 'inactive' })
  }

  // Franja horaria actual (hora argentina)
  const { horaInicio, horaFin } = getFranjaActual(getArgentinaHour())
  const { data: franja } = await db
    .from('franjas_horarias')
    .select('id, premios_cupo, activa')
    .eq('hora_inicio', horaInicio)
    .eq('hora_fin', horaFin)
    .maybeSingle()

  let gano = false
  let codigoPremio: string | null = null

  if (franja?.activa) {
    const { count: premiosEntregados } = await db
      .from('jugadas')
      .select('*', { count: 'exact', head: true })
      .eq('fecha', hoy)
      .eq('franja_id', franja.id)
      .eq('gano', true)

    if ((premiosEntregados ?? 0) < franja.premios_cupo) {
      const { count: jugadasSinPremio } = await db
        .from('jugadas')
        .select('*', { count: 'exact', head: true })
        .eq('fecha', hoy)
        .eq('franja_id', franja.id)
        .eq('gano', false)

      const { data: configSorteo } = await db
        .from('config_sorteo')
        .select('probabilidad_base, incremento_por_jugada')
        .eq('id', 1)
        .single()

      const base = configSorteo?.probabilidad_base ?? 0.05
      const incremento = configSorteo?.incremento_por_jugada ?? 0.05
      const probabilidad = Math.min(0.95, base + (jugadasSinPremio ?? 0) * incremento)

      gano = Math.random() < probabilidad
      codigoPremio = gano ? generateCode() : null
    }
  }

  const { error } = await db.from('jugadas').insert({
    fingerprint,
    fecha: hoy,
    franja_id: franja?.id ?? null,
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
