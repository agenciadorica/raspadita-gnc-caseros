import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

function checkAuth(request: NextRequest): boolean {
  return request.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const db = createServiceClient()
  const { data } = await db
    .from('config_sorteo')
    .select('probabilidad_base, incremento_por_jugada')
    .eq('id', 1)
    .single()

  return Response.json(data)
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { probabilidad_base, incremento_por_jugada } = body

  if (
    typeof probabilidad_base !== 'number' ||
    typeof incremento_por_jugada !== 'number' ||
    probabilidad_base < 0 || probabilidad_base > 1 ||
    incremento_por_jugada < 0 || incremento_por_jugada > 1
  ) {
    return Response.json({ error: 'datos inválidos' }, { status: 400 })
  }

  const db = createServiceClient()
  const { data, error } = await db
    .from('config_sorteo')
    .update({ probabilidad_base, incremento_por_jugada })
    .eq('id', 1)
    .select()
    .single()

  if (error) {
    return Response.json({ error: 'Error al actualizar' }, { status: 500 })
  }

  return Response.json(data)
}
