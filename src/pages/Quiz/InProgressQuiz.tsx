import React, { useContext } from 'react'
import { QuizContext } from './context/QuizContext.ts'
import { Wrapper } from './components/Wrapper.tsx'

export const InProgressQuiz = React.memo(() => {
    const { difficulty } = useContext(QuizContext)

    return <Wrapper title={`In Progress ${difficulty.label}`}>123</Wrapper>
})
