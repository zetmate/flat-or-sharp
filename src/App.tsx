import { Theme } from '@radix-ui/themes'
import { sound } from './audio/sound.ts'
import { Note } from './common/types.ts'

function App() {
    return (
        <Theme appearance="dark">
            <button
                onClick={() => {
                    sound.playTwoNotes({
                        base: {
                            octave: 5,
                            note: Note.C,
                        },
                        cents: 50,
                        flatOrSharp: 'flat',
                        timeShift: 0.5,
                    })
                }}
            >
                Play
            </button>
        </Theme>
    )
}

export default App
