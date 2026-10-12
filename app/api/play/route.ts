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

  // 1 jugada por dispositivo cada 5 horas
  const cincoHorasMs = 5 * 60 * 60 * 1000
  const desde = new Date(Date.now() - cincoHorasMs).toISOString()
  const { data: existing } = await db
    .from('jugadas')
    .select('created_at')
    .eq('fingerprint', fingerprint)
    .gte('created_at', desde)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing) {
    const proximaVez = new Date(new Date(existing.created_at).getTime() + cincoHorasMs).toISOString()
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
    .select('id, premios_cupo, activa, jugadas_minimas_por_premio, minutos_minimos_por_premio, hora_inicio, hora_fin')
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

    const premiosYaEntregados = premiosEntregados ?? 0

    if (premiosYaEntregados < franja.premios_cupo) {
      // Calcular minutos transcurridos desde inicio de franja
      const ahora = new Date()
      const horaArgentina = getArgentinaHour(ahora)
      const minutosArgentina = parseInt(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Argentina/Buenos_Aires',
          minute: '2-digit',
        }).format(ahora),
        10
      )
      let minutosDesdeInicio: number
      if (franja.hora_inicio <= franja.hora_fin) {
        minutosDesdeInicio = (horaArgentina - franja.hora_inicio) * 60 + minutosArgentina
      } else {
        const horasDesdeInicio = horaArgentina >= franja.hora_inicio
          ? horaArgentina - franja.hora_inicio
          : 24 - franja.hora_inicio + horaArgentina
        minutosDesdeInicio = horasDesdeInicio * 60 + minutosArgentina
      }

      // Jugadas totales en la franja hoy
      const { count: jugadasEnFranja } = await db
        .from('jugadas')
        .select('*', { count: 'exact', head: true })
        .eq('fecha', hoy)
        .eq('franja_id', franja.id)

      const jugadasTotales = jugadasEnFranja ?? 0

      // Umbrales para el próximo premio
      const proximoPremioN = premiosYaEntregados + 1
      const jugadasMinimas = (franja.jugadas_minimas_por_premio ?? 0) * proximoPremioN
      const minutosMinimos = (franja.minutos_minimos_por_premio ?? 0) * proximoPremioN

      const cumpleJugadas = jugadasTotales >= jugadasMinimas
      const cumpleTiempo = minutosDesdeInicio >= minutosMinimos

      if (cumpleJugadas && cumpleTiempo) {
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