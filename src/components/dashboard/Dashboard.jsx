import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../services/authService'
import { getCourses } from '../../services/courseService'
import '../auth/Auth.css'
import './Dashboard.css'

export default function Dashboard({ onEnterCourse }) {
  const { user, setUser, logout } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)
  const [courses, setCourses] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [coursesError, setCoursesError] = useState('')

  useEffect(() => {
    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
  }, [user])

  useEffect(() => {
    let cancelled = false

    async function loadCourses() {
      setCoursesLoading(true)
      setCoursesError('')
      try {
        const data = await getCourses()
        if (!cancelled) setCourses(data)
      } catch (err) {
        if (!cancelled) setCoursesError(err.message)
      } finally {
        if (!cancelled) setCoursesLoading(false)
      }
    }

    loadCourses()
    return () => {
      cancelled = true
    }
  }, [])

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
      const payload = { name: name.trim(), email: email.trim() }
      if (password) payload.password = password
      const updated = await updateProfile(payload)
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
          <span className="dashboard-user-greeting">
            Hola, <strong>{user.name}</strong>
          </span>
          <button type="button" className="dashboard-logout" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <div className="auth-section-tag">SYS_DASH // PANEL</div>
          <h1>Tu espacio de aprendizaje</h1>
          <p>Elige un curso para continuar o actualiza tu perfil.</p>
        </div>

        <div className="dashboard-grid">
          <section>
            <h2 className="dashboard-section-title">Mis cursos</h2>
            {coursesError && <div className="auth-error">{coursesError}</div>}
            <div className="dashboard-courses">
              {coursesLoading && <p className="dashboard-courses-status">Cargando cursos...</p>}
              {!coursesLoading && courses.length === 0 && !coursesError && (
                <p className="dashboard-courses-status">No hay cursos disponibles.</p>
              )}
              {courses.map(course => (
                <button
                  key={course.id}
                  type="button"
                  className="course-card"
                  onClick={() => onEnterCourse(course.id)}
                >
                  <div className="auth-corner auth-corner--tl" />
                  <div className="auth-corner auth-corner--tr" />
                  <div className="auth-corner auth-corner--bl" />
                  <div className="auth-corner auth-corner--br" />

                  <div className="course-card-meta">
                    <span className="course-card-badge">Disponible</span>
                    <span className="course-card-stats">
                      {course.lessonCount} lecciones · {course.phaseCount} fases
                    </span>
                  </div>
                  <h2>{course.title}</h2>
                  <p className="course-card-subtitle">{course.subtitle}</p>
                  <p className="course-card-desc">{course.description}</p>
                  <div className="course-card-tags">
                    {course.tags.map(tag => (
                      <span key={tag} className="course-card-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="course-card-cta">Continuar curso</span>
                </button>
              ))}
            </div>
          </section>

          <aside>
            <div className="dashboard-profile-panel">
              <div className="auth-corner auth-corner--tl" />
              <div className="auth-corner auth-corner--tr" />
              <div className="auth-corner auth-corner--bl" />
              <div className="auth-corner auth-corner--br" />

              <div className="auth-section-tag">USR_PROFILE // EDIT</div>
              <h2>Mi perfil</h2>
              <p className="auth-subtitle">Actualiza tu información personal</p>

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
          </aside>
        </div>
      </main>
    </div>
  )
}
