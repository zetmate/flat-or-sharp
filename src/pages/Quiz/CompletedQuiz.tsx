import React, { useContext } from 'react'
import { Button, Flex } from '@radix-ui/themes'
import { Wrapper } from './components/Wrapper.tsx'
import { QuizContext } from './context/QuizContext.ts'

export const CompletedQuiz = React.memo(() => {
    const { questionsCount, correctAnswers, quit } = useContext(QuizContext)
    const resultInPercentage = (correctAnswers / questionsCount) * 100

    return (
        <Wrapper title={`Your score is ${resultInPercentage}%`}>
            <Flex justify="center">
                <Button variant="surface" onClick={quit}>
                    Return
                </Button>
            </Flex>
        </Wrapper>
    )
})
