import React from 'react'
import { useQuiz } from '../../context/QuizContext.tsx'
import { Wrapper } from './components/Wrapper.tsx'

export const InProgressQuiz = React.memo(() => {
    const { difficulty } = useQuiz()

    return <Wrapper title={`In Progress ${difficulty.label}`}>123</Wrapper>
})
