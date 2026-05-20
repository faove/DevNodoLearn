import { useState } from 'react'
import LessonPage from './components/LessonPage'
import { lessons } from './data/lessons'
import './App.css'

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const current = lessons[activeIndex]

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <span className="logo">DevNodo<span className="logo-accent">Learn</span></span>
          <nav className="breadcrumb">
            <span>Python</span>
            <span className="sep">/</span>
            <span className="current">Lección {activeIndex + 1}: {current.title}</span>
          </nav>
        </div>
      </header>

      <div className="app-body">
        <nav className="lessons-nav">
          <p className="lessons-nav-heading">Python</p>
          {lessons.map((l, i) => (
            <button
              key={l.id}
              className={`lessons-nav-item ${activeIndex === i ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <span className="nav-num">{i + 1}</span>
              <span className="nav-title">{l.title}</span>
            </button>
          ))}
        </nav>

        <main className="app-main">
          <LessonPage
            lesson={current}
            exercises={current.exercises}
            lessonNumber={activeIndex + 1}
          />
        </main>
      </div>
    </div>
  )
}
