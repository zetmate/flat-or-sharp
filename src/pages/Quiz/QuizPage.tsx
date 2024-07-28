import { QuizContextProvider } from '../../context/QuizContext.tsx'
import { QuizRouter } from './QuizRouter.tsx'

export const QuizPage = () => {
    return (
        <QuizContextProvider>
            <QuizRouter />
        </QuizContextProvider>
    )
}
