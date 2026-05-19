import { useState, useEffect, useRef } from 'react'

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js'

export function usePyodide() {
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const pyodideRef = useRef(null)

  useEffect(() => {
    if (pyodideRef.current) return
    setStatus('loading')

    const script = document.createElement('script')
    script.src = PYODIDE_CDN
    script.onload = async () => {
      try {
        pyodideRef.current = await window.loadPyodide()
        // redirect stdout/stderr to captured output
        pyodideRef.current.runPython(`
import sys
import io
`)
        setStatus('ready')
      } catch {
        setStatus('error')
      }
    }
    script.onerror = () => setStatus('error')
    document.head.appendChild(script)
  }, [])

  async function runCode(code) {
    if (status !== 'ready') return { output: '', error: 'Python no está listo aún.' }

    const py = pyodideRef.current
    try {
      // capture stdout
      py.runPython(`
import sys, io
_stdout_capture = io.StringIO()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
`)
      await py.runPythonAsync(code)
      const output = py.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
_stdout_capture.getvalue()
`)
      return { output: output || '(sin salida)', error: null }
    } catch (err) {
      py.runPython(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`)
      return { output: '', error: err.message }
    }
  }

  return { status, runCode }
}
