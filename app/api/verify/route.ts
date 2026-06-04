import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { codigo } = body

  if (!codigo || typeof codigo !== 'string') {
    return Response.json({ error: 'código requerido' }, { status: 400 })
  }

  const db = createServiceClient()

  const { data: jugada } = await db
    .from('jugadas')
    .select('id, canjeado, fecha')
    .eq('codigo_premio', codigo.toUpperCase())
    .eq('gano', true)
    .maybeSingle()

  if (!jugada) {
    return Response.json({ valido: false, mensaje: 'Código no encontrado' })
  }

  if (jugada.canjeado) {
    return Response.json({ valido: false, mensaje: 'Este código ya fue canjeado' })
  }

  await db.from('jugadas').update({ canjeado: true }).eq('id', jugada.id)

  return Response.json({ valido: true, mensaje: 'Premio válido. ¡Canjeado exitosamente!' })
}
