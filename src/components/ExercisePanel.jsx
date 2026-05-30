import { useEffect, useState } from 'react'
import CodeEditor from './CodeEditor'
import OutputPanel from './OutputPanel'
import { usePyodide } from '../hooks/usePyodide'
import './ExercisePanel.css'

const STORED_OK_MESSAGE = 'Ejercicio completado previamente.'

function buildInitialResults(exercises, completedExerciseIds) {
  return Object.fromEntries(
    exercises
      .filter(ex => completedExerciseIds.includes(ex.id))
      .map(ex => [ex.id, { ok: true, message: STORED_OK_MESSAGE }])
  )
}

export default function ExercisePanel({
  exercises,
  language = 'python',
  initialIndex = 0,
  completedExerciseIds = [],
  onIndexChange,
  onExerciseComplete,
}) {
  const isHtml = language === 'html'
  const isBash = language === 'bash'
  const isScriptOnly = isBash || language === 'php'

  const safeInitial = Math.min(Math.max(0, initialIndex), Math.max(0, exercises.length - 1))
  const [currentIdx, setCurrentIdx] = useState(safeInitial)
  const [codes, setCodes] = useState(() =>
    Object.fromEntries(exercises.map(ex => [ex.id, ex.starterCode]))
  )
  const [results, setResults] = useState(() =>
    buildInitialResults(exercises, completedExerciseIds)
  )
  const [outputs, setOutputs] = useState({})
  const [running, setRunning] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const { status: pyStatus, runCode } = usePyodide()
  const ex = exercises[currentIdx]
  const code = codes[ex.id]
  const result = results[ex.id]
  const output = outputs[ex.id]

  useEffect(() => {
    const next = Math.min(Math.max(0, initialIndex), Math.max(0, exercises.length - 1))
    setCurrentIdx(next)
  }, [initialIndex, exercises])

  useEffect(() => {
    setResults(prev => ({
      ...prev,
      ...buildInitialResults(exercises, completedExerciseIds),
    }))
  }, [completedExerciseIds, exercises])

  function selectExercise(index) {
    setCurrentIdx(index)
    setShowHint(false)
    onIndexChange?.(index)
  }

  function applyValidation(currentIndex, validation) {
    setResults(prev => ({ ...prev, [ex.id]: validation }))
    if (validation?.ok) {
      onExerciseComplete?.(ex.id, currentIndex, validation)
    }
  }

  async function handleRun() {
    setRunning(true)
    setShowHint(false)

    if (isHtml) {
      setOutputs(prev => ({ ...prev, [ex.id]: { html: code } }))
      const validation = ex.validate('', code)
      applyValidation(currentIdx, validation)
      setRunning(false)
      return
    }

    if (isScriptOnly) {
      const validation = ex.validate('', code)
      applyValidation(currentIdx, validation)
      setRunning(false)
      return
    }

    const { output: out, error } = await runCode(code)
    const displayed = error || out
    setOutputs(prev => ({ ...prev, [ex.id]: { text: displayed, isError: !!error } }))

    if (!error) {
      const validation = ex.validate(out, code)
      applyValidation(currentIdx, validation)
    } else {
      setResults(prev => ({ ...prev, [ex.id]: null }))
    }
    setRunning(false)
  }

  const completedCount = exercises.filter(e => results[e.id]?.ok).length

  return (
    <div className="exercise-panel">
      <div className="exercise-progress">
        <span className="progress-label">Ejercicios</span>
        <div className="progress-tabs">
          {exercises.map((e, i) => (
            <button
              key={e.id}
              className={`progress-tab ${i === currentIdx ? 'active' : ''} ${results[e.id]?.ok ? 'done' : ''}`}
              onClick={() => selectExercise(i)}
            >
              {results[e.id]?.ok ? '✓' : i + 1}
            </button>
          ))}
        </div>
        <span className="progress-count">{completedCount}/{exercises.length} completados</span>
      </div>

      <div className="exercise-header">
        <h3 className="exercise-title">{ex.title}</h3>
        <p className="exercise-desc">{ex.description}</p>
      </div>

      <CodeEditor
        value={code}
        onChange={val => setCodes(prev => ({ ...prev, [ex.id]: val }))}
        onRun={handleRun}
        running={running}
        pyStatus={pyStatus}
        language={language}
      />

      <div className="exercise-actions">
        <button
          className="hint-btn"
          onClick={() => setShowHint(h => !h)}
        >
          {showHint ? 'Ocultar pista' : '¿Necesitas una pista?'}
        </button>

        {currentIdx < exercises.length - 1 && result?.ok && (
          <button
            className="next-btn"
            onClick={() => selectExercise(currentIdx + 1)}
          >
            Siguiente ejercicio →
          </button>
        )}
      </div>

      {showHint && (
        <div className="hint-box">
          <span className="hint-icon">💡</span>
          {ex.hint}
        </div>
      )}

      {output?.html && (
        <div className="html-preview-wrap">
          <div className="html-preview-label">Vista previa</div>
          <iframe
            className="html-preview-frame"
            srcDoc={output.html}
            sandbox="allow-scripts"
            title="Vista previa HTML"
          />
        </div>
      )}

      {output && !output.html && (
        <OutputPanel
          output={output.isError ? '' : output.text}
          error={output.isError ? output.text : null}
          running={running}
        />
      )}

      {result && (
        <div className={`validation-result ${result.ok ? 'result-ok' : 'result-fail'}`}>
          <span>{result.ok ? '✓' : '✗'}</span>
          {result.message}
        </div>
      )}
    </div>
  )
}
