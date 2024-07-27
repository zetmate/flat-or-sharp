import {
    centsToHz,
    getFlatHzFromNote,
    getIntervalNoteFrom,
    getSharpHzFromNote,
    noteToHz,
} from '../utils.ts'
import { Note } from '../../common/types.ts'

describe('Utils for audio', () => {
    describe('noteToHz', () => {
        it('A4 is correct', () => {
            const a4Hz = noteToHz({ note: Note.A, octave: 4 })
            expect(a4Hz).toBe(440)
        })
        it('C3 is correct', () => {
            const hz = noteToHz({ note: Note.C, octave: 3 })
            expect(Math.round(hz)).toBe(131)
        })
        it('D#2 is correct', () => {
            const hz = noteToHz({ note: Note['D#/Eb'], octave: 2 })
            expect(Math.round(hz)).toBe(78)
        })
        it('F5 is correct', () => {
            const hz = noteToHz({ note: Note.F, octave: 5 })
            expect(Math.floor(hz)).toBe(698)
        })
        it('E6 is correct', () => {
            const hz = noteToHz({ note: Note.E, octave: 6 })
            expect(Math.round(hz)).toBe(1319)
        })
    })

    describe('centsToHz', () => {
        it('50cents from A3 to B3 is A#3', () => {
            const result = centsToHz(
                { note: Note.A, octave: 3 },
                { note: Note.B, octave: 3 },
                50
            )
            expect(Math.round(result)).toBe(
                Math.round(noteToHz({ note: Note['A#/Bb'], octave: 3 }))
            )
        })
    })

    describe('getIntervalNoteFrom', () => {
        it('26 semi from B2 is C#5', () => {
            const result = getIntervalNoteFrom({ note: Note.B, octave: 2 }, 26)
            expect(result.note).toBe(Note['C#/Db'])
            expect(result.octave).toBe(5)
        })
        it('-15 semi from D3 is B1', () => {
            const result = getIntervalNoteFrom({ note: Note.D, octave: 3 }, -15)
            expect(result.note).toBe(Note.B)
            expect(result.octave).toBe(1)
        })
        it('2 semi from D5 is E5', () => {
            const result = getIntervalNoteFrom({ note: Note.D, octave: 5 }, 2)
            expect(result.note).toBe(Note.E)
            expect(result.octave).toBe(5)
        })
    })

    describe('getFlatHzFromNote', () => {
        it('99 flat from C3 is B2', () => {
            const result = getFlatHzFromNote({ note: Note.C, octave: 3 }, 99)
            const target = noteToHz({ note: Note.B, octave: 2 })

            // Expect the deviation to be less than 2hz
            expect(Math.abs(result - target)).toBeLessThan(2)
        })
        it('300 flat from G4 is E4', () => {
            const result = getFlatHzFromNote({ note: Note.G, octave: 4 }, 301)
            const target = noteToHz({ note: Note.E, octave: 4 })

            // Expect the deviation to be less than 2hz
            expect(Math.abs(result - target)).toBeLessThan(2)
        })
        it('700 flat from C4 is F3', () => {
            const result = getFlatHzFromNote({ note: Note.C, octave: 4 }, 700)
            const target = noteToHz({ note: Note.F, octave: 3 })

            // Expect the deviation to be less than 2hz
            expect(Math.abs(result - target)).toBeLessThan(2)
        })
    })

    describe('getSharpHzFromNote', () => {
        it('99 sharp from B3 is C4', () => {
            const result = getSharpHzFromNote({ note: Note.B, octave: 3 }, 99)
            const target = noteToHz({ note: Note.C, octave: 4 })

            // Expect the deviation to be less than 2hz
            expect(Math.abs(result - target)).toBeLessThan(2)
        })
        it('400 sharp from G5 is B5', () => {
            const result = getSharpHzFromNote({ note: Note.G, octave: 5 }, 400)
            const target = noteToHz({ note: Note.B, octave: 5 })

            // Expect the deviation to be less than 2hz
            expect(Math.abs(result - target)).toBeLessThan(2)
        })
    })
})
