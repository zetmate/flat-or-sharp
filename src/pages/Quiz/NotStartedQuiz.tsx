import React, { useState } from 'react'
import { Button, Flex, Heading, Slider, Text } from '@radix-ui/themes'
import { useQuiz } from '../../context/QuizContext.tsx'
import { Wrapper } from './components/Wrapper.tsx'
import { defaultDifficulty } from '../../common/constants.ts'

const MAX_CENTS = 100
const MIN_CENTS = 10

const getDifficultyLabel = (cents: number) => {
    if (cents > 75) {
        return 'Very Easy'
    }
    if (cents > 60) {
        return 'Easy'
    }
    if (cents > 30) {
        return 'Normal'
    }
    if (cents > 10) {
        return 'Hard'
    }
    return 'God'
}

export const NotStartedQuiz = React.memo(() => {
    const [cents, setCents] = useState<number>(defaultDifficulty.cents)
    const { start } = useQuiz()
    const label = getDifficultyLabel(cents)

    return (
        <Wrapper>
            <Heading as="h2" size="6">
                Please select difficulty
            </Heading>
            <Flex direction="column" gap="3" pt="4">
                <Text size="4" align="center">
                    {label}: ({cents} cents)
                </Text>
                <Slider
                    step={10}
                    min={MIN_CENTS}
                    max={MAX_CENTS}
                    value={[cents]}
                    onValueChange={(value) => setCents(value[0])}
                />
                <Flex justify="center" pt="4">
                    <Button
                        variant="solid"
                        onClick={() => {
                            console.log('click')
                            start({ cents, label })
                        }}
                    >
                        Start
                    </Button>
                </Flex>
            </Flex>
        </Wrapper>
    )
})
