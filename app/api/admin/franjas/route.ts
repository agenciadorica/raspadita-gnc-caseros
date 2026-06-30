import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getArgentinaDateString } from '@/lib/franjas'

export const dynamic = 'force-dynamic'

function checkAuth(request: NextRequest): boolean {
  return request.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const db = createServiceClient()
  const hoy = getArgentinaDateString()

  const { data: franjas } = await db
    .from('franjas_horarias')
    .select('id, hora_inicio, hora_fin, premios_cupo, activa')
    .order('hora_inicio', { ascending: true })

  const { data: jugadasHoy } = await db
    .from('jugadas')
    .select('franja_id, gano')
    .eq('fecha', hoy)
    .eq('gano', true)

  const entregadosPorFranja = new Map<number, number>()
  for (const j of jugadasHoy ?? []) {
    if (j.franja_id == null) continue
    entregadosPorFranja.set(j.franja_id, (entregadosPorFranja.get(j.franja_id) ?? 0) + 1)
  }

  return Response.json({
    fecha: hoy,
    franjas: (franjas ?? []).map((f) => ({
      ...f,
      premiosEntregadosHoy: entregadosPorFranja.get(f.id) ?? 0,
    })),
  })
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { id, premios_cupo } = body

  if (typeof id !== 'number' || typeof premios_cupo !== 'number' || premios_cupo < 0) {
    return Response.json({ error: 'datos inválidos' }, { status: 400 })
  }

  const db = createServiceClient()
  const { data, error } = await db
    .from('franjas_horarias')
    .update({ premios_cupo })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return Response.json({ error: 'Error al actualizar' }, { status: 500 })
  }

  return Response.json(data)
}
