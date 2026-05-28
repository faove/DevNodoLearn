import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import CourseView from './components/CourseView'
import './App.css'

function MainApp() {
  const { user, loading } = useAuth()
  const [authView, setAuthView] = useState('login')
  const [appView, setAppView] = useState('dashboard')

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Cargando...
      </div>
    )
  }

  if (!user) {
    return authView === 'login'
      ? <Login onGoRegister={() => setAuthView('register')} />
      : <Register onGoLogin={() => setAuthView('login')} />
  }

  if (appView === 'course') {
    return <CourseView onBack={() => setAppView('dashboard')} />
  }

  return (
    <Dashboard
      onEnterCourse={() => setAppView('course')}
    />
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
