import React, { useContext } from 'react'
import { Button, Flex, Slider, Text, Switch } from '@radix-ui/themes'
import { QuizContext } from './context/QuizContext.ts'
import { Wrapper } from './components/Wrapper.tsx'
import { defaultDifficulty } from '../../common/constants.ts'
import { useValue } from '../../components/LocalStorage'
import { lsValues } from '../../common/lsValues.ts'
import { getIntervalLabel } from './common.ts'

type Range = [number, number]
const dummyRange: Range = [100, 700]
const normalRange: Range = [10, 100]
const defaultDummyCents = 400

const getDifficultyLabel = (cents: number) => {
    if (cents > 100) {
        return 'Beginner'
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
    const { start } = useContext(QuizContext)
    const {
        value: { dummyModeOn, cents },
        updateValue: updateSettings,
    } = useValue(lsValues.quizSettings)

    const label = getDifficultyLabel(cents)

    const range = dummyModeOn ? dummyRange : normalRange

    return (
        <Wrapper title="Please select difficulty">
            <Flex gap="2" justify="center" pb="4">
                <Text size="2">Enable beginner mode</Text>
                <Switch
                    checked={dummyModeOn}
                    onCheckedChange={(checked) => {
                        if (checked) {
                            updateSettings({
                                dummyModeOn: true,
                                cents: defaultDummyCents,
                            })
                        } else {
                            updateSettings({
                                dummyModeOn: false,
                                cents: defaultDifficulty.cents,
                            })
                        }
                    }}
                />
            </Flex>
            <Text size="4" align="center">
                {label}: ({getIntervalLabel(cents)})
            </Text>
            <Slider
                step={dummyModeOn ? 100 : 10}
                min={range[0]}
                max={range[1]}
                value={[cents]}
                onValueChange={(value) => updateSettings({ cents: value[0] })}
            />
            <Flex justify="center" pt="4">
                <Button
                    variant="solid"
                    onClick={() => {
                        start({ cents, label })
                    }}
                >
                    Start
                </Button>
            </Flex>
        </Wrapper>
    )
})
