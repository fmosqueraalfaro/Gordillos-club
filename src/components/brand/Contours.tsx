import type { SVGProps } from "react"

/**
 * Motivo de anillos concéntricos (evoca el "radio / zona" de un mapa).
 * Atmósfera sutil de marca; se usa muy tenue detrás de los héroes.
 */
export function Contours({ className, ...props }: SVGProps<SVGSVGElement>) {
  const rings = [50, 95, 140, 185, 230, 275]
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      {...props}
    >
      {rings.map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          stroke="currentColor"
          strokeWidth="1.25"
          opacity={0.5 - i * 0.06}
        />
      ))}
    </svg>
  )
}
