import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../services/authService'
import '../auth/Auth.css'
import './Dashboard.css'

export default function Profile({ onBack }) {
  const { user, setUser } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.profile?.phone ?? '')
  const [address, setAddress] = useState(user?.profile?.address ?? '')
  const [city, setCity] = useState(user?.profile?.city ?? '')
  const [country, setCountry] = useState(user?.profile?.country ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
    setPhone(user?.profile?.phone ?? '')
    setAddress(user?.profile?.address ?? '')
    setCity(user?.profile?.city ?? '')
    setCountry(user?.profile?.country ?? '')
  }, [user])

  async function handleProfileSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password && password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setSaving(true)
    try {
      const updated = await updateProfile({
        name: name.trim(),
        email: email.trim(),
        password,
        phone,
        address,
        city,
        country,
      })
      setUser(updated)
      setPassword('')
      setSuccess('Perfil actualizado correctamente.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dashboard-page">
      <div className="auth-scanlines" />

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

      <header className="dashboard-header">
        <div className="auth-logo dashboard-logo">
          DevNodo<span className="auth-logo-accent">Learn</span>
        </div>
        <div className="dashboard-header-actions">
          <button type="button" className="dashboard-back-btn" onClick={onBack}>
            <svg className="dashboard-btn-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver al panel
          </button>
        </div>
      </header>

      <main className="dashboard-main dashboard-main--profile">
        <div className="dashboard-welcome">
          <div className="auth-section-tag">USR_PROFILE // EDIT</div>
          <h1>Mi perfil</h1>
          <p>Actualiza tu información personal, contacto y credenciales de acceso.</p>
        </div>

        <div className="dashboard-profile-panel dashboard-profile-panel--page">
          <div className="auth-corner auth-corner--tl" />
          <div className="auth-corner auth-corner--tr" />
          <div className="auth-corner auth-corner--bl" />
          <div className="auth-corner auth-corner--br" />

          <form className="auth-form" onSubmit={handleProfileSubmit}>
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="dashboard-success">{success}</div>}

            <div className="auth-field">
              <label htmlFor="profile-name">Nombre completo</label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="profile-email">Correo electrónico</label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="profile-phone">Celular</label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="+52 55 1234 5678"
              />
            </div>

            <hr className="dashboard-profile-divider" />

            <div className="auth-field">
              <label htmlFor="profile-address">Dirección</label>
              <input
                id="profile-address"
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                autoComplete="street-address"
                placeholder="Calle, número, colonia"
              />
            </div>

            <div className="dashboard-profile-row">
              <div className="auth-field">
                <label htmlFor="profile-city">Ciudad</label>
                <input
                  id="profile-city"
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  autoComplete="address-level2"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="profile-country">País</label>
                <input
                  id="profile-country"
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  autoComplete="country-name"
                />
              </div>
            </div>

            <hr className="dashboard-profile-divider" />

            <div className="auth-field">
              <label htmlFor="profile-password">Nueva contraseña</label>
              <input
                id="profile-password"
                type="password"
                placeholder="Dejar vacío para no cambiar"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <p className="dashboard-profile-hint">Mínimo 8 caracteres si deseas cambiarla.</p>
            </div>

            <button
              className={`auth-btn${saving ? ' auth-loading' : ''}`}
              type="submit"
              disabled={saving}
            >
              {saving ? '▸ Guardando...' : '▸ Guardar cambios'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
