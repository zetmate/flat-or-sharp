import { Container, Theme } from '@radix-ui/themes'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { routePaths } from './common/routes.ts'
import { QuizPage } from './pages/Quiz/QuizPage.tsx'

function App() {
    return (
        <Theme appearance="dark" accentColor="teal">
            <Container>
                <Router>
                    <Switch>
                        <Route path={routePaths.index}>
                            <QuizPage />
                        </Route>
                    </Switch>
                </Router>
            </Container>
        </Theme>
    )
}

export default App
