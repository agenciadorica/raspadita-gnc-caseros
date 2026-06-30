import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getArgentinaDateString } from '@/lib/franjas'

export const dynamic = 'force-dynamic'

function checkAuth(request: NextRequest): boolean {
  return request.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { fingerprint, todas } = body

  if (!todas && (!fingerprint || typeof fingerprint !== 'string')) {
    return Response.json({ error: 'fingerprint requerido' }, { status: 400 })
  }

  const db = createServiceClient()
  const hoy = getArgentinaDateString()

  let query = db.from('jugadas').delete({ count: 'exact' }).eq('fecha', hoy)
  if (!todas) {
    query = query.eq('fingerprint', fingerprint)
  }

  const { count, error } = await query

  if (error) {
    return Response.json({ error: 'Error al borrar jugadas' }, { status: 500 })
  }

  return Response.json({ ok: true, jugadas_borradas: count ?? 0 })
}
