import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react'
import {
    Difficulty,
    FlatOrSharp,
    QuizQuestion,
    QuizState,
} from '../common/types.ts'
import { defaultDifficulty, QUESTIONS_COUNT } from '../common/constants.ts'
import { sound } from '../audio/sound.ts'

interface QuizContextValue {
    state: QuizState
    difficulty: Difficulty
    questionsCount: number
    currentQuestionNum: number
    currentQuestion: QuizQuestion | null
    correctAnswers: number

    answer(flatOrSharp: FlatOrSharp): void

    next(): void

    start(difficulty: Difficulty): void

    quit(): void
}

const QuizContext = React.createContext<QuizContextValue | null>(null)

export const QuizContextProvider = React.memo<PropsWithChildren>(
    ({ children }) => {
        const [state, setState] = useState<QuizState>('not-started')
        const [difficulty, setDifficulty] =
            useState<Difficulty>(defaultDifficulty)
        const [currentQuestion, setCurrentQuestion] =
            useState<QuizQuestion | null>(null)
        const [currentQuestionNum, setCurrentQuestionNum] = useState(0)
        const [correctAnswers, setCorrectAnswers] = useState(0)
        const [questionsCount] = useState(QUESTIONS_COUNT)

        const answer = useCallback(
            (flatOrSharp: FlatOrSharp) => {
                if (!currentQuestion) {
                    throw new Error(
                        `[QuizContextProvider]: answer failed, question is ${currentQuestion}`
                    )
                }
                const answerResult =
                    flatOrSharp === currentQuestion.flatOrSharp
                        ? 'right'
                        : 'wrong'
                setState(answerResult)
                if (answerResult === 'right') {
                    setCorrectAnswers(correctAnswers + 1)
                }
            },
            [currentQuestion, correctAnswers]
        )

        const next = useCallback(() => {
            const isLastQuestion = currentQuestionNum === questionsCount
            if (isLastQuestion) {
                setState('completed')
                setCurrentQuestion(null)
                setCurrentQuestionNum(0)
            } else {
                const nextQuestion = sound.getRandomQuizQuestion()
                setCurrentQuestion(nextQuestion)
                setState('answer-pending')
                setCurrentQuestionNum(currentQuestionNum + 1)
            }
        }, [currentQuestionNum, questionsCount])

        const start = useCallback((difficulty: Difficulty) => {
            setDifficulty(difficulty)
            setState('answer-pending')
            const nextQuestion = sound.getRandomQuizQuestion()
            setCurrentQuestion(nextQuestion)
            setCurrentQuestionNum(1)
            setCorrectAnswers(0)
        }, [])

        const quit = useCallback(() => {
            setState('not-started')
            setCurrentQuestionNum(0)
            setCurrentQuestion(null)
            setCorrectAnswers(0)
        }, [])

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
    }
)
