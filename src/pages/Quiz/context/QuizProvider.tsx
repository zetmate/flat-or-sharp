import React, { PropsWithChildren, useCallback, useMemo } from 'react'
import { Difficulty, FlatOrSharp } from '../../../common/types.ts'
import { sound } from '../../../audio/sound.ts'
import { QuizContext, QuizContextValue } from './QuizContext.ts'
import { useValue } from '../../../components/LocalStorage'
import { lsValues } from '../../../common/lsValues.ts'

export const QuizProvider = React.memo<PropsWithChildren>(({ children }) => {
    const {
        updateValue,
        value: {
            currentQuestion,
            currentQuestionNum,
            questionsCount,
            correctAnswers,
            difficulty,
            state,
        },
    } = useValue(lsValues.quizData)

    const answer = useCallback(
        (flatOrSharp: FlatOrSharp) => {
            if (!currentQuestion) {
                throw new Error(
                    `[QuizContextProvider]: answer failed, question is ${currentQuestion}`
                )
            }
            const answerResult =
                flatOrSharp === currentQuestion.flatOrSharp ? 'right' : 'wrong'

            updateValue({
                state: answerResult,
                correctAnswers:
                    answerResult === 'right'
                        ? correctAnswers + 1
                        : correctAnswers,
            })
        },
        [currentQuestion, updateValue, correctAnswers]
    )

    const next = useCallback(() => {
        const isLastQuestion = currentQuestionNum === questionsCount
        if (isLastQuestion) {
            updateValue({
                state: 'completed',
                currentQuestion: null,
                currentQuestionNum: 0,
            })
        } else {
            updateValue({
                state: 'answer-pending',
                currentQuestionNum: currentQuestionNum + 1,
                currentQuestion: sound.getRandomQuizQuestion(),
            })
        }
    }, [currentQuestionNum, questionsCount, updateValue])

    const start = useCallback(
        (difficulty: Difficulty) => {
            updateValue({
                difficulty,
                state: 'answer-pending',
                currentQuestion: sound.getRandomQuizQuestion(),
                currentQuestionNum: 1,
                correctAnswers: 0,
            })
        },
        [updateValue]
    )

    const quit = useCallback(() => {
        updateValue({
            state: 'not-started',
            currentQuestionNum: 0,
            currentQuestion: null,
            correctAnswers: 0,
        })
    }, [updateValue])

    const contextValue = useMemo<QuizContextValue>(
        () => ({
            state,
            difficulty,
            questionsCount,
            currentQuestionNum,
            currentQuestion,
            correctAnswers,
            answer,
            next,
            start,
            quit,
        }),
        [
            state,
            difficulty,
            questionsCount,
            currentQuestionNum,
            currentQuestion,
            correctAnswers,
            answer,
            next,
            start,
            quit,
        ]
    )

    return (
        <QuizContext.Provider value={contextValue}>
            {children}
        </QuizContext.Provider>
    )
})
