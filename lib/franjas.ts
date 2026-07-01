const TIMEZONE = 'America/Argentina/Buenos_Aires'

/** Fecha actual en horario argentino, formato YYYY-MM-DD */
export function getArgentinaDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** Hora actual (0-23) en horario argentino */
export function getArgentinaHour(date: Date = new Date()): number {
  const hourStr = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    hour12: false,
  }).format(date)
  // Intl puede devolver "24" para medianoche en algunos entornos
  return parseInt(hourStr, 10) % 24
}

/** Devuelve el inicio y fin (hora_inicio, hora_fin) de la franja de 8hs que contiene la hora dada.
 * La franja nocturna (22-06) cruza medianoche. */
export function getFranjaActual(hour: number): { horaInicio: number; horaFin: number } {
  if (hour >= 6 && hour < 14) return { horaInicio: 6, horaFin: 14 }
  if (hour >= 14 && hour < 22) return { horaInicio: 14, horaFin: 22 }
  return { horaInicio: 22, horaFin: 6 }
}
