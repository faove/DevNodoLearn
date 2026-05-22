import { lesson as lesson1, exercises as exercises1 } from './lesson1'
import { lesson as lesson2, exercises as exercises2 } from './lesson2'
import { lesson as lesson3, exercises as exercises3 } from './lesson3'
import { lesson as lesson4, exercises as exercises4 } from './lesson4'
import { lesson as lesson5, exercises as exercises5 } from './lesson5'
import { lesson as lesson6, exercises as exercises6 } from './lesson6'

export const lessons = [
  { ...lesson1, exercises: exercises1, phase: 1 },
  { ...lesson2, exercises: exercises2, phase: 1 },
  { ...lesson3, exercises: exercises3, phase: 1 },
  { ...lesson4, exercises: exercises4, phase: 2 },
  { ...lesson5, exercises: exercises5, phase: 2 },
  { ...lesson6, exercises: exercises6, phase: 2 },
]
