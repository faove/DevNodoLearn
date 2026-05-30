import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getCourses } from '../../services/courseService'
import '../auth/Auth.css'
import './Dashboard.css'

export default function Dashboard({ onEnterCourse, onGoProfile }) {
  const { user, logout } = useAuth()
  const [courses, setCourses] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [coursesError, setCoursesError] = useState('')

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
          <button type="button" className="dashboard-profile-link" onClick={onGoProfile}>
            <svg className="dashboard-btn-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Mi perfil
          </button>
          <button type="button" className="dashboard-logout" onClick={logout}>
            <svg className="dashboard-btn-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <div className="auth-section-tag">SYS_DASH // PANEL</div>
          <h1>Tu espacio de aprendizaje</h1>
          <p>Elige un curso para continuar.</p>
        </div>

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
      </main>
    </div>
  )
}
