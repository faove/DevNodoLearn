import { getCourse, DEFAULT_COURSE_SLUG } from './registry'

const defaultCourse = getCourse(DEFAULT_COURSE_SLUG)

export const RANKS = defaultCourse.ranks
export const CHAPTER_TITLES = defaultCourse.chapterTitles
export const RANK_SIZE = defaultCourse.rankSize

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

export function buildPathFromLessons(
  lessonList,
  { tagByPhase = {}, maxPhase = 4 } = {},
) {
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
      tag:
        isLastInPhase && lesson.phase < maxPhase
          ? 'boss'
          : tagByPhase[lesson.phase] ?? 'core',
      exerciseCount: lesson.exercises?.length ?? 0,
      sectionCount: lesson.sections?.length ?? 0,
    }
  })
}

export function buildPathForCourse(slug) {
  const course = getCourse(slug)
  if (!course) return []
  return buildPathFromLessons(course.lessons, {
    tagByPhase: course.tagByPhase,
    maxPhase: course.maxPhase,
  })
}

export const PATH = buildPathForCourse(DEFAULT_COURSE_SLUG)

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
