import React from 'react'
import { Button, Flex, Heading } from '@radix-ui/themes'
import { useQuiz } from '../../context/QuizContext.tsx'
import { Wrapper } from './components/Wrapper.tsx'

export const CompletedQuiz = React.memo(() => {
    const { questionsCount, correctAnswers } = useQuiz()
    const resultInPercentage = (correctAnswers / questionsCount) * 100

    return (
        <Wrapper>
            <Heading as="h2" size="7">
                Your score is {resultInPercentage}%
            </Heading>
            <Flex justify="between">
                <Button variant="surface">Return</Button>
                <Button variant="solid">Retry</Button>
            </Flex>
        </Wrapper>
    )
})
