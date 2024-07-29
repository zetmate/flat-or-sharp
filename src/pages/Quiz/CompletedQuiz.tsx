import React, { useContext } from 'react'
import { Button, Flex, Text } from '@radix-ui/themes'
import { Wrapper } from './components/Wrapper.tsx'
import { QuizContext } from './context/QuizContext.ts'
import { getIntervalLabel } from './common.ts'

const getEmoji = (resultInPercentage: number) => {
    if (resultInPercentage === 100) {
        return '🎉'
    }
    if (resultInPercentage > 70) {
        return '👍'
    }
    if (resultInPercentage > 50) {
        return '👌'
    }
}

export const CompletedQuiz = React.memo(() => {
    const { questionsCount, correctAnswers, quit, difficulty } =
        useContext(QuizContext)
    const resultInPercentage = (correctAnswers / questionsCount) * 100

    return (
        <Wrapper
            title={`Your score is ${resultInPercentage}% ${getEmoji(resultInPercentage)}`}
        >
            <Text align="center">
                {difficulty.label} ({getIntervalLabel(difficulty.cents)})
            </Text>
            <Flex justify="center" pt="4">
                <Button variant="surface" onClick={quit}>
                    Return
                </Button>
            </Flex>
        </Wrapper>
    )
})
