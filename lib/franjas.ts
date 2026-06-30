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

/** Devuelve el inicio (par, 0-22) de la franja horaria de 2hs que contiene la hora dada */
export function getFranjaInicio(hour: number): number {
  return Math.floor(hour / 2) * 2
}
