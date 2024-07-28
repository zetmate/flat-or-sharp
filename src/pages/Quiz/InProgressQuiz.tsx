import React from 'react'
import { Heading } from '@radix-ui/themes'
import { useQuiz } from '../../context/QuizContext.tsx'
import { Wrapper } from './components/Wrapper.tsx'

export const InProgressQuiz = React.memo(() => {
    const { difficulty } = useQuiz()

    return (
        <Wrapper>
            <Heading as="h2" size="7">
                In Progress {difficulty.label}
            </Heading>
        </Wrapper>
    )
})
