import { QuizContextProvider } from './context/QuizContextProvider.tsx'
import { QuizRouter } from './QuizRouter.tsx'

export const QuizPage = () => {
    return (
        <QuizContextProvider>
            <QuizRouter />
        </QuizContextProvider>
    )
}
