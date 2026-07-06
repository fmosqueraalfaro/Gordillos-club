const ARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
})

/** Formatea un precio en pesos, ej. 12500 → "$12.500". Null si no hay precio. */
export function formatPrice(value: number | null | undefined): string | null {
  if (value == null) return null
  return ARS.format(value)
}
