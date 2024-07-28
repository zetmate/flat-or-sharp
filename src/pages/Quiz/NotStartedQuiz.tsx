import React, { useContext, useState } from 'react'
import { Button, Flex, Slider, Text } from '@radix-ui/themes'
import { QuizContext } from '../../context/QuizContext.ts'
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
    const { start } = useContext(QuizContext)
    const label = getDifficultyLabel(cents)

    return (
        <Wrapper title="Please select difficulty">
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
        </Wrapper>
    )
})
