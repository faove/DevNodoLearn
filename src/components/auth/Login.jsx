import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { login } from '../../services/authService'
import './Auth.css'

export default function Login({ onGoRegister }) {
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      setUser(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Scanlines overlay */}
      <div className="auth-scanlines" />

      {/* Floating particles */}
      <div className="auth-particles">
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
        <div className="auth-particle" />
      </div>

      <div className="auth-logo">
        DevNodo<span className="auth-logo-accent">Learn</span>
      </div>

      <div className="auth-card">
        {/* Corner decorations */}
        <div className="auth-corner auth-corner--tl" />
        <div className="auth-corner auth-corner--tr" />
        <div className="auth-corner auth-corner--bl" />
        <div className="auth-corner auth-corner--br" />

        <div className="auth-section-tag">SYS_AUTH // ACCESO</div>

        <h1>Iniciar sesión</h1>
        <p className="auth-subtitle">Accede a tu cuenta para continuar aprendiendo</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            className={`auth-btn${loading ? ' auth-loading' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? '▸ Verificando...' : '▸ Ingresar'}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta?{' '}
          <button type="button" onClick={onGoRegister}>Regístrate</button>
        </p>
      </div>
    </div>
  )
}
