const FMT = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

/**
 * Formatea una fecha `YYYY-MM-DD` (sin hora) a algo lindo en español,
 * ej. "6 jul 2026". Parsea como fecha local para evitar el corrimiento de
 * un día por zona horaria (new Date("2026-07-06") sería UTC medianoche).
 */
export function formatVisitedOn(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number)
  if (!y || !m || !d) return isoDate
  return FMT.format(new Date(y, m - 1, d))
}
