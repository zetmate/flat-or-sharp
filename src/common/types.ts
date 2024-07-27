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

export type Dir = 'flat' | 'sharp'

export type OscType = 'sine' | 'sawtooth'

export interface QuizQuestion {
    note: Note
    octave: number
    dir: Dir
}
