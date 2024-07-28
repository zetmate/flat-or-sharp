import { quizDefaultValue } from '../../../common/constants.ts'
import { Difficulty, FlatOrSharp, QuizValue } from '../../../common/types.ts'
import React from 'react'

export interface QuizContextValue extends QuizValue {
    answer(flatOrSharp: FlatOrSharp): void

    next(): void

    start(difficulty: Difficulty): void

    quit(): void
}

const emptyMethod = () => {
    throw new Error('[QuizContext]: no provider found')
}

export const QuizContext = React.createContext<QuizContextValue>({
    ...quizDefaultValue,
    answer: emptyMethod,
    next: emptyMethod,
    start: emptyMethod,
    quit: emptyMethod,
})
