import React from 'react'
import { useQuiz } from '../../context/QuizContext.tsx'
import { InProgressQuiz } from './InProgressQuiz.tsx'
import { CompletedQuiz } from './CompletedQuiz.tsx'
import { NotStartedQuiz } from './NotStartedQuiz.tsx'

export const QuizRouter = React.memo(() => {
    const { state } = useQuiz()

    switch (state) {
        case 'answer-pending':
        case 'right':
        case 'wrong':
            return <InProgressQuiz />
        case 'completed':
            return <CompletedQuiz />
        case 'not-started':
            return <NotStartedQuiz />
        default:
            return null
    }
})
