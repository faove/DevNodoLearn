import { getLessons, DEFAULT_COURSE_SLUG } from './registry'

/** @deprecated Prefer getLessons(courseSlug) from registry */
export const lessons = getLessons(DEFAULT_COURSE_SLUG)
