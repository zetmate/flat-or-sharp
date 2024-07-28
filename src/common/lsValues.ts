import { ValueID } from '../components/LocalStorage/types.ts'
import { createLSValue } from '../components/LocalStorage'
import { QuizValue } from './types.ts'

export const lsValues = {
    quizData: createLSValue<QuizValue>('quizValue' as ValueID),
}
