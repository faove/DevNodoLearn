import { useState } from 'react'
import { lesson, exercises } from '../data/lesson1'
import ExercisePanel from './ExercisePanel'
import TutorChat from './TutorChat'
import CodeEditor from './CodeEditor'
import OutputPanel from './OutputPanel'
import { usePyodide } from '../hooks/usePyodide'
import './LessonPage.css'

export default function LessonPage() {
  const [activeTab, setActiveTab] = useState('lesson')
  const [sandboxCode, setSandboxCode] = useState('# Prueba el código de los ejemplos aquí\nprint("¡Hola, Python!")\n')
  const [sandboxOutput, setSandboxOutput] = useState(null)
  const [sandboxRunning, setSandboxRunning] = useState(false)
  const [currentCode, setCurrentCode] = useState('')

  const { status: pyStatus, runCode } = usePyodide()

  async function runSandbox() {
    setSandboxRunning(true)
    const { output, error } = await runCode(sandboxCode)
    setSandboxOutput({ text: error || output, isError: !!error })
    setSandboxRunning(false)
  }

  return (
    <div className="lesson-page">
      {/* Columna izquierda: contenido de la lección */}
      <aside className="lesson-sidebar">
        <div className="lesson-meta">
          <span className="lesson-badge">Lección 1</span>
          <h1 className="lesson-title">{lesson.title}</h1>
          <p className="lesson-subtitle">{lesson.subtitle}</p>
        </div>

        <div className="lesson-sections">
          {lesson.sections.map(section => (
            <div key={section.id} className="lesson-section">
              <h2 className="section-title">{section.title}</h2>
              <p className="section-content">{formatContent(section.content)}</p>
              {section.example && (
                <div className="example-block">
                  <div className="example-label">Ejemplo</div>
                  <pre className="example-code">{section.example}</pre>
                  <button
                    className="example-try-btn"
                    onClick={() => {
                      setSandboxCode(section.example)
                      setActiveTab('sandbox')
                    }}
                  >
                    Probar en el editor →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Columna derecha: editor + ejercicios + tutor */}
      <div className="lesson-workspace">
        <div className="workspace-tabs">
          {[
            { id: 'sandbox', label: 'Sandbox' },
            { id: 'exercises', label: `Ejercicios (${exercises.length})` },
            { id: 'tutor', label: 'Tutor AI' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`workspace-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="workspace-content">
          {activeTab === 'sandbox' && (
            <div className="tab-sandbox">
              <CodeEditor
                value={sandboxCode}
                onChange={setSandboxCode}
                onRun={runSandbox}
                running={sandboxRunning}
                pyStatus={pyStatus}
              />
              <OutputPanel
                output={sandboxOutput?.isError ? '' : sandboxOutput?.text}
                error={sandboxOutput?.isError ? sandboxOutput?.text : null}
                running={sandboxRunning}
              />
            </div>
          )}

          {activeTab === 'exercises' && (
            <ExercisePanel exercises={exercises} />
          )}

          {activeTab === 'tutor' && (
            <TutorChat
              lessonContext={lesson.title}
              userCode={currentCode}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function formatContent(text) {
  // Simple markdown bold: **text** → <strong>
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i}>{part}</strong>
      : part.split(/`(.+?)`/g).map((p, j) =>
          j % 2 === 1 ? <code key={j}>{p}</code> : p
        )
  )
}
