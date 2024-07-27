import { FlatOrSharp, Note, NoteWithOctave } from '../common/types.ts'
import { allNotes, NoteToIdx, OCTAVE_SEMITONES } from '../common/constants.ts'

/**
 * Returns frequency of the note. Doesn't support octaves below the 1st.
 */
export const noteToHz = ({ note, octave }: NoteWithOctave) => {
    if (octave < 1) {
        return note
    }
    return note * 2 ** (Math.floor(octave) - 1)
}

export function getIntervalNoteFrom(
    base: NoteWithOctave,
    intervalSemi: number
): { note: Note; octave: number } {
    function getOctaveChange() {
        if (intervalSemi > 0) {
            const extraOctaveChange = baseIdx > resultNoteIdx ? 1 : 0
            const intervalOctaveChange = Math.floor(intervalSemi / 12)
            return intervalOctaveChange + extraOctaveChange
        }
        const extraOctaveChange = baseIdx < resultNoteIdx ? -1 : 0
        const intervalOctaveChange = Math.floor(Math.abs(intervalSemi) / 12)
        return extraOctaveChange - intervalOctaveChange
    }

    const baseIdx = NoteToIdx[base.note]
    // Multiple octaves are added for supporting "negative" intervals
    const resultNoteIdx =
        (OCTAVE_SEMITONES * 10 + baseIdx + intervalSemi) % OCTAVE_SEMITONES
    const resultNote = allNotes[resultNoteIdx]
    if (!resultNote) {
        throw new Error(
            `[getIntervalFromNote]: failed to calculate, index is ${resultNoteIdx}`
        )
    }

    return { note: resultNote, octave: base.octave + getOctaveChange() }
}

/**
 * Converts cents to hz in relation to the provided notes
 */
export const centsToHz = (
    lowerNote: NoteWithOctave,
    higherNote: NoteWithOctave,
    cents: number
) => {
    const lowerHz = noteToHz(lowerNote)
    const higherHz = noteToHz(higherNote)

    const normalizedCents = Math.min(100, Math.max(0, cents))
    const ratio = normalizedCents / 100
    const hzDiff = higherHz - lowerHz

    return lowerHz + hzDiff * ratio
}

const getSemitonesFromCents = (cents: number) => {
    const semitones = Math.ceil(Math.abs(cents) / 100)
    return cents % 100 === 0 ? semitones + 1 : semitones
}

/**
 * Returns hz that is a flat note from the base
 * @param base
 * @param cents - amount of cents
 */
export const getFlatHzFromNote = (base: NoteWithOctave, cents: number) => {
    const semitones = getSemitonesFromCents(cents)
    const lowerNote = getIntervalNoteFrom(base, -semitones)
    const higherNote = getIntervalNoteFrom(lowerNote, 1)
    const centsToApply = 100 - (cents % 100)

    return centsToHz(lowerNote, higherNote, centsToApply)
}

/**
 * Returns hz that is a sharp note from the base
 * @param base
 * @param cents - amount of cents
 */
export const getSharpHzFromNote = (base: NoteWithOctave, cents: number) => {
    const semitones = getSemitonesFromCents(cents)
    const higherNote = getIntervalNoteFrom(base, semitones)
    const lowerNote = getIntervalNoteFrom(higherNote, -1)
    const centsToApply = cents % 100

    return centsToHz(lowerNote, higherNote, centsToApply)
}

export const getDetunedHzFromNote = (
    base: NoteWithOctave,
    cents: number,
    flatOrSharp: FlatOrSharp
) => {
    switch (flatOrSharp) {
        case 'flat':
            return getFlatHzFromNote(base, cents)
        case 'sharp':
            return getSharpHzFromNote(base, cents)
        default:
            throw new Error(
                `Expected: "flat" or "sharp", received: ${flatOrSharp}`
            )
    }
}
