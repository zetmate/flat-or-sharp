import { Dir, Note, OscType, QuizQuestion } from '../common/types.ts'
import { noteToHz } from './utils.ts'
import { allNotes, MAX_OCTAVE, MIN_OCTAVE } from '../common/constants.ts'

export interface PlayOneNoteOptions {
    note: Note
    octave: number
    oscType: OscType
}

export interface PlayTwoNotesOptions {
    base: { note: Note; octave: number }
    diff: number
    dir: 'flat' | 'sharp'
}

interface ISound {
    gain: number

    playOneNote(options: PlayOneNoteOptions): void

    playTwoNotes(options: PlayTwoNotesOptions): void
}

class Sound implements ISound {
    private baseOsc: OscType = 'sine'
    private diffOsc: OscType = 'sawtooth'
    gain = 0.5

    playOneNote(options: PlayOneNoteOptions) {
        const { ctx, closeContext } = this.prepareForPlay(1)
        this.play(
            ctx,
            {
                time: ctx.currentTime,
                oscType: options.oscType,
                hz: noteToHz(options.note, options.octave),
            },
            closeContext
        )
    }

    playTwoNotes({ base, diff, dir }: PlayTwoNotesOptions) {
        const { ctx, closeContext } = this.prepareForPlay(2)

        const time = ctx.currentTime
        const hz = noteToHz(base.note, base.octave)

        // play base
        this.play(
            ctx,
            {
                time,
                hz,
                oscType: this.baseOsc,
            },
            closeContext
        )

        // play diff
        const diffHz = dir === 'flat' ? hz - diff : hz + diff
        this.play(
            ctx,
            {
                time,
                hz: diffHz,
                oscType: this.diffOsc,
            },
            closeContext
        )
    }

    getRandomQuizQuestion(): QuizQuestion {
        return {
            dir: this.getRandomDir(),
            note: this.getRandomNote(),
            octave: this.getRandomOctave(),
        }
    }

    private getRandomDir(): Dir {
        const random = Math.round(Math.random())
        return random === 0 ? 'flat' : 'sharp'
    }

    private getRandomNote() {
        const randomIdx = Math.floor(Math.random() * 12)
        return allNotes[randomIdx]
    }

    private getRandomOctave() {
        return Math.floor(
            Math.random() * (MAX_OCTAVE - MIN_OCTAVE + 1) + MIN_OCTAVE
        )
    }

    private play(
        ctx: AudioContext,
        { time, hz, oscType }: { time: number; hz: number; oscType: OscType },
        onEnded: () => void
    ) {
        const osc = new OscillatorNode(ctx, {
            type: oscType,
            frequency: hz,
        })
        const gainNode = new GainNode(ctx)
        gainNode.gain.setValueAtTime(this.gain, time)
        osc.connect(gainNode)
        gainNode.connect(ctx.destination)

        osc.start(time)
        osc.stop(time + 1)
        osc.onended = onEnded
    }

    // TODO: this whole thing is kinda awful, rewrite to promise base for closing contexts
    private prepareForPlay(soundSourcesCount: number) {
        const ctx = new AudioContext()
        let counter = 1

        // only close when both osc played
        const closeContext = () => {
            if (counter === soundSourcesCount) {
                void ctx.close()
            } else {
                counter++
            }
        }
        return { ctx, closeContext }
    }
}

export const sound = new Sound()
