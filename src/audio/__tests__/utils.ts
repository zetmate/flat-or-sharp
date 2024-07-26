import { noteToHz } from '../utils.ts'
import { Note } from '../../common/types.ts'

describe('Utils for audio', () => {
    describe('noteToHz', () => {
        it('A4 is correct', () => {
            const a4Hz = noteToHz(Note.A, 4)
            expect(a4Hz).toBe(440)
        })
        it('C3 is correct', () => {
            const hz = noteToHz(Note.C, 3)
            expect(Math.round(hz)).toBe(131)
        })
        it('D#2 is correct', () => {
            const hz = noteToHz(Note['D#/Eb'], 2)
            expect(Math.round(hz)).toBe(78)
        })
        it('F5 is correct', () => {
            const hz = noteToHz(Note.F, 5)
            expect(Math.floor(hz)).toBe(698)
        })
        it('E6 is correct', () => {
            const hz = noteToHz(Note.E, 6)
            expect(Math.round(hz)).toBe(1319)
        })
    })
})
