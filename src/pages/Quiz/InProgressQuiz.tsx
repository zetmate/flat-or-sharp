import React, { useCallback, useContext } from 'react'
import { QuizContext } from './context/QuizContext.ts'
import { Wrapper } from './components/Wrapper.tsx'
import { Button, Flex, IconButton } from '@radix-ui/themes'
import { PlayIcon } from '@radix-ui/react-icons'
import { sound } from '../../audio/sound.ts'
import { FlatOrSharp } from '../../common/types.ts'

export const InProgressQuiz = React.memo(() => {
    const {
        questionsCount,
        currentQuestion,
        currentQuestionNum,
        difficulty,
        state,
        answer,
    } = useContext(QuizContext)

    const play = useCallback(
        async (overrideDirection?: 'flat' | 'sharp') => {
            if (!currentQuestion) {
                return
            }
            const { note, octave, flatOrSharp } = currentQuestion

            await sound.playTwoNotes({
                base: { note, octave },
                cents: difficulty.cents,
                flatOrSharp: overrideDirection || flatOrSharp,
            })
        },
        [currentQuestion, difficulty.cents]
    )

    const onAnswerClick = useCallback(
        (flatOrSharp: FlatOrSharp) => {
            if (state === 'answer-pending') {
                answer(flatOrSharp)
            } else {
                void play(flatOrSharp)
            }
        },
        [currentQuestion, state]
    )

    const getTitle = () => {
        const baseTitle = `Question ${currentQuestionNum}/${questionsCount}`
        if (state === 'answer-pending') {
            return baseTitle
        }
        if (state === 'wrong') {
            return `${baseTitle}: wrong answer`
        }
        if (state === 'right') {
            return `${baseTitle}: correct answer`
        }
        return 'Error occurred'
    }

    const getButtonColor = (flatOrSharp: FlatOrSharp) => {
        if (state === 'answer-pending') {
            return undefined
        }
        return flatOrSharp === currentQuestion?.flatOrSharp ? 'green' : 'red'
    }

    return (
        <Wrapper title={getTitle()}>
            <Flex justify="center" pb="5">
                <IconButton
                    color={
                        state === 'answer-pending'
                            ? undefined
                            : state === 'right'
                              ? 'green'
                              : 'red'
                    }
                    variant="ghost"
                    onClick={() => void play()}
                >
                    <PlayIcon width="50" height="50" />
                </IconButton>
            </Flex>
            <Flex justify="center" gap="6">
                <Button
                    color={getButtonColor('flat')}
                    variant="outline"
                    onClick={() => onAnswerClick('flat')}
                >
                    Flat
                </Button>
                <Button
                    color={getButtonColor('sharp')}
                    variant="outline"
                    onClick={() => onAnswerClick('sharp')}
                >
                    Sharp
                </Button>
            </Flex>
        </Wrapper>
    )
})