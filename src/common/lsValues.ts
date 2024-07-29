import { ValueID } from '../components/LocalStorage/types.ts'
import { createLSValue } from '../components/LocalStorage'
import { QuizSettings, QuizValue } from './types.ts'

export const lsValues = {
    quizData: createLSValue<QuizValue>('quizValue' as ValueID),
    quizSettings: createLSValue<QuizSettings>('quizSettings' as ValueID),
}
