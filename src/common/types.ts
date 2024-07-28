export enum Note {
    C = 32.7032,
    'C#/Db' = 34.6478,
    D = 36.7081,
    'D#/Eb' = 38.8909,
    E = 41.2034,
    F = 43.6535,
    'F#/Gb' = 46.2493,
    G = 48.9994,
    'G#/Ab' = 51.9131,
    A = 55,
    'A#/Bb' = 58.2705,
    B = 61.7354,
}

export type NoteWithOctave = {
    note: Note
    octave: number
}

export type FlatOrSharp = 'flat' | 'sharp'

export type OscType = 'sine' | 'sawtooth' | 'square'

export type QuizState =
    | 'not-started'
    | 'answer-pending'
    | 'completed'
    | 'right'
    | 'wrong'

export interface QuizQuestion {
    note: Note
    octave: number
    flatOrSharp: FlatOrSharp
}

export interface Difficulty {
    cents: number
    label: string
}

export interface QuizValue {
    state: QuizState
    difficulty: Difficulty
    questionsCount: number
    currentQuestionNum: number
    currentQuestion: QuizQuestion | null
    correctAnswers: number
}
