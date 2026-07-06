import type { ReactNode } from "react"
import { MapIcon, BookIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

export type AppView = "map" | "diary"

/**
 * Barra de navegación inferior (mobile-first) para alternar Mapa / Diario.
 * A futuro suma Recomendar / Perfil.
 */
export function BottomNav({
  value,
  onChange,
}: {
  value: AppView
  onChange: (view: AppView) => void
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 border-t border-border bg-paper/90 backdrop-blur">
      <div
        className="mx-auto flex max-w-md items-stretch"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <NavItem
          active={value === "map"}
          onClick={() => onChange("map")}
          icon={<MapIcon className="size-5" />}
          label="Mapa"
        />
        <NavItem
          active={value === "diary"}
          onClick={() => onChange("diary")}
          icon={<BookIcon className="size-5" />}
          label="Diario"
        />
      </div>
    </nav>
  )
}

function NavItem({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition",
        active ? "text-aqua" : "text-muted hover:text-ink",
      )}
    >
      {icon}
      {label}
    </button>
  )
}
