export type BarrioFeature = {
  type: "Feature"
  properties: { nombre: string; comuna: number }
  geometry: { type: "Polygon"; coordinates: number[][][] }
}

export type BarriosGeoJson = {
  type: "FeatureCollection"
  features: BarrioFeature[]
}

/** ¿El punto (x,y) está dentro del anillo? Ray casting. Coords en [lng, lat]. */
function pointInRing(x: number, y: number, ring: number[][]): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0]
    const yi = ring[i][1]
    const xj = ring[j][0]
    const yj = ring[j][1]
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

/** ¿El punto (lng, lat) cae dentro del polígono (anillo exterior menos huecos)? */
export function pointInPolygon(lng: number, lat: number, coordinates: number[][][]): boolean {
  if (coordinates.length === 0) return false
  if (!pointInRing(lng, lat, coordinates[0])) return false
  for (let i = 1; i < coordinates.length; i++) {
    if (pointInRing(lng, lat, coordinates[i])) return false // está en un hueco
  }
  return true
}

/** Cuenta cuántos puntos (lugares) caen en cada barrio, por nombre. */
export function countByBarrio(
  points: { lat: number; lng: number }[],
  features: BarrioFeature[],
): Map<string, number> {
  const counts = new Map<string, number>()
  for (const point of points) {
    for (const feature of features) {
      if (pointInPolygon(point.lng, point.lat, feature.geometry.coordinates)) {
        const name = feature.properties.nombre
        counts.set(name, (counts.get(name) ?? 0) + 1)
        break
      }
    }
  }
  return counts
}
