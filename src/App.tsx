import { Theme } from '@radix-ui/themes'
import { sound } from './audio/sound.ts'
import { Note } from './common/types.ts'

function App() {
    return (
        <Theme appearance="dark">
            <button
                onClick={() => {
                    sound.playOneNote({
                        oscType: 'sawtooth',
                        octave: 4,
                        note: Note.C,
                    })
                }}
            >
                Play
            </button>
        </Theme>
    )
}

export default App
