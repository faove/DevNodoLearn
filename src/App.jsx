import { useState } from 'react'
import LessonPage from './components/LessonPage'
import { lessons } from './data/lessons'
import './App.css'

const PHASE_LABELS = {
  1: 'Fase 1: Python',
  2: 'Fase 2: Web',
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const current = lessons[activeIndex]

  const phases = [...new Set(lessons.map(l => l.phase))]

  return (
    <div className="app" data-phase={current.phase}>
      <header className="app-header">
        <div className="app-header-inner">
          <span className="logo">DevNodo<span className="logo-accent">Learn</span></span>
          <nav className="breadcrumb">
            <span>{PHASE_LABELS[current.phase]}</span>
            <span className="sep">/</span>
            <span className="current">Lección {activeIndex + 1}: {current.title}</span>
          </nav>
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
                <span className="lessons-nav-heading">{PHASE_LABELS[phase]}</span>
                {phaseLessons.map(l => (
                  <button
                    key={l.id}
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
