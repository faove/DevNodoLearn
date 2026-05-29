const LOCAL_API_URL = 'http://localhost:8000/api'

function isLocalFrontend() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

function resolveApiUrl() {
  // dist built for production is served on localhost:3001 — still use local API
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
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = Object.values(data?.errors ?? {})[0]?.[0]
      ?? data?.message
      ?? 'Error inesperado'
    throw new Error(message)
  }

  return data
}

export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim(), password }),
  })
  localStorage.setItem('auth_token', data.token)
  return data.user
}

export async function register(name, email, password) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      password,
      password_confirmation: password,
    }),
  })
  localStorage.setItem('auth_token', data.token)
  return data.user
}

export async function logout() {
  try {
    await request('/auth/logout', { method: 'POST' })
  } finally {
    localStorage.removeItem('auth_token')
  }
}

export async function getMe() {
  return request('/auth/me')
}

export async function updateProfile({ name, email, password }) {
  const body = { name, email }
  if (password) {
    body.password = password
    body.password_confirmation = password
  }
  const data = await request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(body),
  })
  return data.user ?? data
}
