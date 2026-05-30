import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import LessonPage from './LessonPage'
import { getCourse } from '../data/registry'
import { completeNode } from '../services/courseService'
import { nodeIdForLessonIndex } from '../data/devNodoPath'
import './CourseView.css'

function CourseViewShell({ dataPhase, children }) {
  return (
    <div className="courseview-root" data-phase={dataPhase}>
      <div className="courseview-grid-floor" aria-hidden />
      {children}
    </div>
  )
}

function CourseViewEmpty({ message, onBack }) {
  return (
    <CourseViewShell dataPhase={1}>
      <div className="courseview-empty">
        <p className="courseview-empty-msg">{message}</p>
        <button type="button" className="courseview-btn-back" onClick={onBack}>
          ← VOLVER
        </button>
      </div>
    </CourseViewShell>
  )
}

export default function CourseView({ courseSlug = 'programacion-jovenes', onBack, initialLessonIndex = 0 }) {
  const { user, logout } = useAuth()
  const course = getCourse(courseSlug)
  const [activeIndex, setActiveIndex] = useState(initialLessonIndex)
  const [completing, setCompleting] = useState(false)

  if (!course) {
    return (
      <CourseViewEmpty
        message={<>Curso no encontrado: <code>{courseSlug}</code></>}
        onBack={onBack}
      />
    )
  }

  const { lessons, phaseLabels } = course
  const current = lessons[activeIndex]

  if (!current) {
    return (
      <CourseViewEmpty
        message="Lección no disponible."
        onBack={onBack}
      />
    )
  }

  const phases = [...new Set(lessons.map(l => l.phase))]

  return (
    <CourseViewShell dataPhase={current.phase}>
      <header className="courseview-hud">
        <button type="button" className="courseview-btn-back" onClick={onBack}>
          ← MAPA
        </button>

        <div className="courseview-hud-brand">
          <div className="courseview-hud-logo">
            <div className="courseview-hud-logo-outer" />
            <div className="courseview-hud-logo-inner">
              <span>D</span>
            </div>
          </div>
          <div>
            <div className="courseview-hud-title-main">DEV-NODE</div>
            <div className="courseview-hud-title-sub">LEARN · SESSION</div>
          </div>
        </div>

        <div className="courseview-hud-divider" />

        <nav className="courseview-breadcrumb" aria-label="Ubicación">
          <span className="courseview-section-tag">{phaseLabels[current.phase]}</span>
          <span className="courseview-breadcrumb-sep">/</span>
          <span className="courseview-breadcrumb-current">
            L_{String(activeIndex + 1).padStart(2, '0')} · {current.title}
          </span>
        </nav>

        <div className="courseview-hud-actions">
          <button
            type="button"
            className="courseview-btn-neon"
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
            {completing ? 'GUARDANDO...' : '✓ COMPLETAR'}
          </button>
          <div className="courseview-hud-user">
            <span className="courseview-user-name">{user.name}</span>
            <button className="courseview-btn-ghost" type="button" onClick={logout}>
              LOGOUT
            </button>
          </div>
        </div>
      </header>
    

      <main className="courseview-main">
        <LessonPage
          key={current.id}
          lesson={current}
          exercises={current.exercises}
          lessonNumber={activeIndex + 1}
        />
      </main>
    </CourseViewShell>
  )
}
