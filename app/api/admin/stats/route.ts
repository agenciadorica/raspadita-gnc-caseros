import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getArgentinaDateString } from '@/lib/franjas'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password')
  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const db = createServiceClient()
  const today = getArgentinaDateString()

  const [{ count: totalJugadas }, { count: totalGanadores }, { count: canjeados }] =
    await Promise.all([
      db.from('jugadas').select('*', { count: 'exact', head: true }).eq('fecha', today),
      db.from('jugadas').select('*', { count: 'exact', head: true }).eq('fecha', today).eq('gano', true),
      db.from('jugadas').select('*', { count: 'exact', head: true }).eq('fecha', today).eq('gano', true).eq('canjeado', true),
    ])

  return Response.json({
    fecha: today,
    totalJugadas: totalJugadas ?? 0,
    totalGanadores: totalGanadores ?? 0,
    canjeados: canjeados ?? 0,
  })
}
