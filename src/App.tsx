import { useState } from "react"
import { useAuth } from "@/features/auth/AuthProvider"
import { AuthPage } from "@/features/auth/AuthPage"
import { AppLayout } from "@/components/layout/AppLayout"
import { BottomNav } from "@/components/layout/BottomNav"
import type { AppView } from "@/components/layout/BottomNav"
import { MapView } from "@/features/map/MapView"
import { DiaryView } from "@/features/diary/DiaryView"
import { cn } from "@/lib/utils"

function App() {
  const { loading, session } = useAuth()
  const [view, setView] = useState<AppView>("map")

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="animate-pulse text-4xl">🍽️</div>
      </div>
    )
  }

  if (!session) {
    return <AuthPage />
  }

  return (
    <AppLayout bleed>
      <div className="relative h-full w-full">
        {/* El mapa queda siempre montado (aunque esté oculto) para no gastar
            cargas de Google Maps al alternar de vista. `invisible` conserva su
            tamaño → no se rompe al volver. */}
        <div className={cn("absolute inset-0", view !== "map" && "invisible")}>
          <MapView />
        </div>

        {view === "diary" && (
          <div className="absolute inset-0 overflow-y-auto bg-paper">
            <DiaryView onGoToMap={() => setView("map")} />
          </div>
        )}

        <BottomNav value={view} onChange={setView} />
      </div>
    </AppLayout>
  )
}

export default App
