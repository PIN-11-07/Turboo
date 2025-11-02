import { AuthProvider } from './app/context/AuthContext'
import RootNavigation from './app/navigation'

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  )
}
