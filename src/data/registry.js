import programacionJovenes from './courses/programacion-jovenes'

const coursesBySlug = {
  'programacion-jovenes': programacionJovenes,
}

export const DEFAULT_COURSE_SLUG = 'programacion-jovenes'

export function getCourse(slug) {
  return coursesBySlug[slug] ?? null
}

export function getLessons(slug) {
  return getCourse(slug)?.lessons ?? []
}

export function listCourseSlugs() {
  return Object.keys(coursesBySlug)
}
