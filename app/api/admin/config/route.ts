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
  const { data } = await db.from('config').select('*').eq('id', 1).single()
  return Response.json(data)
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { premios_por_dia, activo } = body

  const db = createServiceClient()
  const { data, error } = await db
    .from('config')
    .update({ premios_por_dia, activo })
    .eq('id', 1)
    .select()
    .single()

  if (error) {
    return Response.json({ error: 'Error al actualizar' }, { status: 500 })
  }

  return Response.json(data)
}
