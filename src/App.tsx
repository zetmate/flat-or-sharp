import { Container, Theme } from '@radix-ui/themes'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { routePaths } from './common/routes.ts'

function App() {
    return (
        <Theme appearance="dark">
            <Container>
                <Router>
                    <Switch>
                        <Route path={routePaths.index}>Play</Route>
                    </Switch>
                </Router>
            </Container>
        </Theme>
    )
}

export default App
