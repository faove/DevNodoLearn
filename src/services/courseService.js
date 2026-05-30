const LOCAL_API_URL = 'http://localhost:8000/api'

function isLocalFrontend() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

function resolveApiUrl() {
  if (isLocalFrontend()) {
    return LOCAL_API_URL
  }

  const raw = (import.meta.env.VITE_API_URL || LOCAL_API_URL).replace(/\/$/, '')
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && raw.startsWith('http://')) {
    return raw.replace(/^http:\/\//, 'https://')
  }
  return raw
}

const API_URL = resolveApiUrl()

function getToken() {
  return localStorage.getItem('auth_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      Object.values(data?.errors ?? {})[0]?.[0] ?? data?.message ?? 'Error inesperado'
    throw new Error(message)
  }

  return data
}

export async function getCourses() {
  return request('/courses')
}

export async function getCoursePath(courseSlug) {
  return request(`/courses/${courseSlug}/path`)
}

export async function completeNode(courseSlug, nodeId) {
  return request(`/courses/${courseSlug}/nodes/${nodeId}/complete`, {
    method: 'POST',
  })
}

export async function getLessonProgress(courseSlug, nodeId) {
  return request(`/courses/${courseSlug}/nodes/${nodeId}/lesson-progress`)
}

export async function saveCourseProgress(courseSlug, { lessonIndex, exerciseIndex, nodeId, completedExerciseId }) {
  const body = {
    lesson_index: lessonIndex,
    exercise_index: exerciseIndex,
  }
  if (nodeId) {
    body.node_id = nodeId
  }
  if (completedExerciseId) {
    body.completed_exercise_id = completedExerciseId
  }
  return request(`/courses/${courseSlug}/progress`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}
