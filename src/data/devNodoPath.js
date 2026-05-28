import { lessons } from './lessons'

export const RANKS = [
  { lvl: 0, name: 'Bootloader', sub: 'Fundamentos de computación' },
  { lvl: 1, name: 'Code Initiate', sub: 'Python básico' },
  { lvl: 2, name: 'Logic Apprentice', sub: 'Python intermedio' },
  { lvl: 3, name: 'Frontend Knight', sub: 'HTML, CSS y JavaScript' },
  { lvl: 4, name: 'Version Keeper', sub: 'Git y GitHub' },
  { lvl: 5, name: 'Backend Padawan', sub: 'PHP y Laravel' },
  { lvl: 6, name: 'Fullstack Mage', sub: 'Proyecto final integrador' },
]

export const CHAPTER_TITLES = {
  1: 'CH·01 / Python — Fundamentos',
  2: 'CH·02 / Desarrollo Web',
  3: 'CH·03 / Git & GitHub',
  4: 'CH·04 / PHP & Laravel',
}

const TAG_BY_PHASE = {
  1: 'python',
  2: 'web',
  3: 'git',
  4: 'laravel',
}

function estimateXp(lesson) {
  const sections = lesson.sections?.length ?? 3
  const exercises = lesson.exercises?.length ?? 3
  return sections * 25 + exercises * 45
}

function estimateMins(lesson) {
  const sections = lesson.sections?.length ?? 3
  const exercises = lesson.exercises?.length ?? 3
  return sections * 8 + exercises * 6
}

export function buildPathFromLessons(lessonList = lessons) {
  return lessonList.map((lesson, index) => {
    const num = index + 1
    const isLastInPhase =
      index === lessonList.length - 1 ||
      lessonList[index + 1]?.phase !== lesson.phase

    return {
      id: `n${String(num).padStart(2, '0')}`,
      lessonId: lesson.id,
      lessonIndex: index,
      chapter: lesson.phase,
      title: lesson.title,
      sub: lesson.subtitle,
      xp: estimateXp(lesson),
      mins: estimateMins(lesson),
      tag: isLastInPhase && lesson.phase < 4 ? 'boss' : TAG_BY_PHASE[lesson.phase] ?? 'core',
      exerciseCount: lesson.exercises?.length ?? 0,
      sectionCount: lesson.sections?.length ?? 0,
    }
  })
}

export const PATH = buildPathFromLessons()

export const RANK_SIZE = 500

export function getStorageKey(userId) {
  return `devnodo-completed-${userId ?? 'guest'}`
}

export function getCompletedNodes(userId) {
  try {
    const saved = localStorage.getItem(getStorageKey(userId))
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function markNodeComplete(userId, nodeId) {
  const key = getStorageKey(userId)
  const completed = getCompletedNodes(userId)
  if (completed.includes(nodeId)) return completed
  const next = [...completed, nodeId]
  localStorage.setItem(key, JSON.stringify(next))
  return next
}

export function nodeIdForLessonIndex(index) {
  return `n${String(index + 1).padStart(2, '0')}`
}
