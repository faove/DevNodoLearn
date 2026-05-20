import { lesson as lesson1, exercises as exercises1 } from './lesson1'
import { lesson as lesson2, exercises as exercises2 } from './lesson2'
import { lesson as lesson3, exercises as exercises3 } from './lesson3'

export const lessons = [
  { ...lesson1, exercises: exercises1 },
  { ...lesson2, exercises: exercises2 },
  { ...lesson3, exercises: exercises3 },
]
