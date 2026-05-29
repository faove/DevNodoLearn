import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import DevNodo from './components/DevNodo'
import CourseView from './components/CourseView'
import './App.css'

function MainApp() {
  const { user, loading } = useAuth()
  const [authView, setAuthView] = useState('login')
  const [appView, setAppView] = useState('dashboard')
  const [courseSlug, setCourseSlug] = useState('programacion-jovenes')
  const [lessonIndex, setLessonIndex] = useState(0)
  const [devNodoKey, setDevNodoKey] = useState(0)

  function backToDevNodo() {
    setDevNodoKey(k => k + 1)
    setAppView('devnodo')
  }

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
    return (
      <CourseView
        courseSlug={courseSlug}
        initialLessonIndex={lessonIndex}
        onBack={backToDevNodo}
      />
    )
  }

  if (appView === 'devnodo') {
    return (
      <DevNodo
        key={devNodoKey}
        courseSlug={courseSlug}
        onBack={() => setAppView('dashboard')}
        onStartLesson={index => {
          setLessonIndex(index)
          setAppView('course')
        }}
      />
    )
  }

  return (
    <Dashboard
      onEnterCourse={slug => {
        setCourseSlug(slug)
        setAppView('devnodo')
      }}
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
