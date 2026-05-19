import './OutputPanel.css'

export default function OutputPanel({ output, error, running }) {
  if (running) {
    return (
      <div className="output-panel output-running">
        <span className="output-spinner" /> Ejecutando…
      </div>
    )
  }

  if (!output && !error) {
    return (
      <div className="output-panel output-empty">
        Presiona <kbd>Ejecutar</kbd> para ver el resultado aquí.
      </div>
    )
  }

  return (
    <div className={`output-panel ${error ? 'output-error' : 'output-ok'}`}>
      <div className="output-label">{error ? 'Error' : 'Salida'}</div>
      <pre className="output-text">{error || output}</pre>
    </div>
  )
}
