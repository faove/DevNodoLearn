import { useRef } from 'react'
import Editor from '@monaco-editor/react'
import './CodeEditor.css'

export default function CodeEditor({ value, onChange, onRun, running, pyStatus }) {
  const editorRef = useRef(null)

  function handleMount(editor) {
    editorRef.current = editor
    editor.addCommand(
      // Ctrl+Enter / Cmd+Enter to run
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      onRun
    )
  }

  const statusLabel = {
    idle: 'Iniciando…',
    loading: 'Cargando Python…',
    ready: 'Python listo',
    error: 'Error al cargar Python',
  }[pyStatus]

  const statusClass = pyStatus === 'ready' ? 'status-ready' : pyStatus === 'error' ? 'status-error' : 'status-loading'

  return (
    <div className="code-editor-wrap">
      <div className="editor-toolbar">
        <div className={`py-status ${statusClass}`}>
          <span className="py-status-dot" />
          {statusLabel}
        </div>
        <button
          className="run-btn"
          onClick={onRun}
          disabled={pyStatus !== 'ready' || running}
        >
          {running ? '▶ Ejecutando…' : '▶ Ejecutar'}
          <span className="run-shortcut">Ctrl+Enter</span>
        </button>
      </div>

      <Editor
        height="260px"
        language="python"
        theme="vs-dark"
        value={value}
        onChange={onChange}
        onMount={handleMount}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 12 },
          renderLineHighlight: 'line',
          smoothScrolling: true,
        }}
      />
    </div>
  )
}
