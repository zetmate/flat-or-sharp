import { Note } from '../common/types.ts'

/**
 * Returns frequency of the note. Doesn't support octaves below the 1st.
 * @param note
 * @param octave
 */
export const noteToHz = (note: Note, octave: number) => {
    if (octave < 1) {
        return note
    }
    return note * 2 ** (Math.floor(octave) - 1)
}
