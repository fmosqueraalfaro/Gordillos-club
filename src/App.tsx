import { useAuth } from "@/features/auth/AuthProvider"
import { AuthPage } from "@/features/auth/AuthPage"
import { AppLayout } from "@/components/layout/AppLayout"
import { HomeView } from "@/features/home/HomeView"

function App() {
  const { loading, session } = useAuth()

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
    <AppLayout>
      <HomeView />
    </AppLayout>
  )
}

export default App
