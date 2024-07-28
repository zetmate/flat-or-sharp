import { QuizProvider } from './context/QuizProvider.tsx'
import { QuizRouter } from './QuizRouter.tsx'
import { WithValue } from '../../components/LocalStorage'
import { lsValues } from '../../common/lsValues.ts'
import { quizDefaultValue } from '../../common/constants.ts'

export const QuizPage = () => {
    return (
        <WithValue lsValue={lsValues.quizData} defaultValue={quizDefaultValue}>
            <QuizProvider>
                <QuizRouter />
            </QuizProvider>
        </WithValue>
    )
}
