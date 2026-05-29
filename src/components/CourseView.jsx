import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import LessonPage from './LessonPage'
import { getCourse } from '../data/registry'
import { completeNode } from '../services/courseService'
import { nodeIdForLessonIndex } from '../data/devNodoPath'

export default function CourseView({ courseSlug = 'programacion-jovenes', onBack, initialLessonIndex = 0 }) {
  const { user, logout } = useAuth()
  const course = getCourse(courseSlug)
  const [activeIndex, setActiveIndex] = useState(initialLessonIndex)
  const [completing, setCompleting] = useState(false)

  if (!course) {
    return (
      <div className="app">
        <div className="app-body" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
          <p>Curso no encontrado: {courseSlug}</p>
          <button type="button" className="back-dashboard-btn" onClick={onBack}>
            ← Volver
          </button>
        </div>
      </div>
    )
  }

  const { lessons, phaseLabels } = course
  const current = lessons[activeIndex]

  if (!current) {
    return (
      <div className="app">
        <div className="app-body" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
          <p>Lección no disponible.</p>
          <button type="button" className="back-dashboard-btn" onClick={onBack}>
            ← Volver
          </button>
        </div>
      </div>
    )
  }

  const phases = [...new Set(lessons.map(l => l.phase))]

  return (
    <div className="app" data-phase={current.phase}>
      <header className="app-header">
        <div className="app-header-inner">
          <button type="button" className="back-dashboard-btn" onClick={onBack}>
            ← Mapa Dev-Node
          </button>
          <button
            type="button"
            className="back-dashboard-btn"
            disabled={completing}
            onClick={async () => {
              setCompleting(true)
              try {
                await completeNode(courseSlug, nodeIdForLessonIndex(activeIndex))
                onBack()
              } catch {
                onBack()
              } finally {
                setCompleting(false)
              }
            }}
          >
            {completing ? 'Guardando...' : '✓ Completar nodo'}
          </button>
          <span className="logo">DevNodo<span className="logo-accent">Learn</span></span>
          <nav className="breadcrumb">
            <span>{phaseLabels[current.phase]}</span>
            <span className="sep">/</span>
            <span className="current">Lección {activeIndex + 1}: {current.title}</span>
          </nav>
          <div className="header-user">
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" type="button" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="app-body">
        <nav className="lessons-nav">
          {phases.map((phase, pi) => {
            const phaseLessons = lessons
              .map((l, i) => ({ ...l, globalIndex: i }))
              .filter(l => l.phase === phase)
            return (
              <div key={phase} className="phase-group" data-phase={phase}>
                {pi > 0 && <span className="phase-divider" />}
                <span className="lessons-nav-heading">{phaseLabels[phase]}</span>
                {phaseLessons.map(l => (
                  <button
                    key={l.id}
                    type="button"
                    className={`lessons-nav-item ${activeIndex === l.globalIndex ? 'active' : ''}`}
                    onClick={() => setActiveIndex(l.globalIndex)}
                  >
                    <span className="nav-num">{l.globalIndex + 1}</span>
                    <span className="nav-title">{l.title}</span>
                  </button>
                ))}
              </div>
            )
          })}
        </nav>

        <main className="app-main">
          <LessonPage
            key={current.id}
            lesson={current}
            exercises={current.exercises}
            lessonNumber={activeIndex + 1}
          />
        </main>
      </div>
    </div>
  )
}
