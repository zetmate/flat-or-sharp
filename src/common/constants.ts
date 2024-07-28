import { Difficulty, Note, QuizValue } from './types.ts'

export const MIN_OCTAVE = 3
export const MAX_OCTAVE = 5
export const QUESTIONS_COUNT = 10

export const OCTAVE_SEMITONES = 12

export const defaultDifficulty: Difficulty = {
    cents: 50,
    label: 'Normal',
}

export const allNotes = [
    Note.C,
    Note['C#/Db'],
    Note.D,
    Note['D#/Eb'],
    Note.E,
    Note.F,
    Note['F#/Gb'],
    Note.G,
    Note['G#/Ab'],
    Note.A,
    Note['A#/Bb'],
    Note.B,
]

export const NoteToIdx: Record<Note, number> = {
    [Note.C]: 0,
    [Note['C#/Db']]: 1,
    [Note.D]: 2,
    [Note['D#/Eb']]: 3,
    [Note.E]: 4,
    [Note.F]: 5,
    [Note['F#/Gb']]: 6,
    [Note.G]: 7,
    [Note['G#/Ab']]: 8,
    [Note.A]: 9,
    [Note['A#/Bb']]: 10,
    [Note.B]: 11,
}

export const noteName: Record<Note, string> = {
    [Note.C]: 'C',
    [Note['C#/Db']]: 'C#/Db',
    [Note.D]: 'D',
    [Note['D#/Eb']]: 'D#/Eb',
    [Note.E]: 'E',
    [Note.F]: 'F',
    [Note['F#/Gb']]: 'F#/Gb',
    [Note.G]: 'G',
    [Note['G#/Ab']]: 'G#/Ab',
    [Note.A]: 'A',
    [Note['A#/Bb']]: 'A#/Bb',
    [Note.B]: 'B',
}

export const quizDefaultValue: QuizValue = {
    state: 'not-started',
    difficulty: defaultDifficulty,
    questionsCount: QUESTIONS_COUNT,
    currentQuestionNum: 0,
    currentQuestion: null,
    correctAnswers: 0,
}
