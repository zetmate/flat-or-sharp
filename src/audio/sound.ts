import { FlatOrSharp, Note, OscType, QuizQuestion } from '../common/types.ts'
import { getDetunedHzFromNote, noteToHz } from './utils.ts'
import { allNotes, MAX_OCTAVE, MIN_OCTAVE } from '../common/constants.ts'

export interface PlayOneNoteOptions {
    note: Note
    octave: number
    oscType: OscType
}

export interface PlayTwoNotesOptions {
    base: { note: Note; octave: number }
    cents: number
    flatOrSharp: 'flat' | 'sharp'
    timeShift?: number
}

interface ISound {
    gain: number

    playOneNote(options: PlayOneNoteOptions): void

    playTwoNotes(options: PlayTwoNotesOptions): void
}

class Sound implements ISound {
    private baseOsc: OscType = 'sine'
    private diffOsc: OscType = 'square'
    gain = 0.5
    filterFreq = 2_000

    playOneNote(options: PlayOneNoteOptions) {
        const { ctx, closeContext } = this.prepareForPlay(1)
        this.play(
            ctx,
            {
                startTime: ctx.currentTime,
                length: 1,
                oscType: options.oscType,
                hz: noteToHz(options),
            },
            closeContext
        )
    }

    playTwoNotes({
        base,
        cents,
        flatOrSharp,
        timeShift = 1,
    }: PlayTwoNotesOptions) {
        const { ctx, closeContext } = this.prepareForPlay(2)

        const startTime = ctx.currentTime
        const baseHz = noteToHz(base)
        const diffHz = getDetunedHzFromNote(base, cents, flatOrSharp)

        // play base
        this.play(
            ctx,
            {
                startTime,
                length: 1 + timeShift,
                hz: baseHz,
                oscType: this.baseOsc,
            },
            closeContext
        )

        // play diff
        this.play(
            ctx,
            {
                startTime: startTime + timeShift,
                length: 1,
                hz: diffHz,
                oscType: this.diffOsc,
            },
            closeContext
        )
    }

    getRandomQuizQuestion(): QuizQuestion {
        return {
            flatOrSharp: this.getRandomDir(),
            note: this.getRandomNote(),
            octave: this.getRandomOctave(),
        }
    }

    private getRandomDir(): FlatOrSharp {
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
        {
            startTime,
            length,
            hz,
            oscType,
        }: { startTime: number; length: number; hz: number; oscType: OscType },
        onEnded: () => void
    ) {
        const osc = new OscillatorNode(ctx, {
            type: oscType,
            frequency: hz,
        })
        this.connectToEffectsChainAndOutput(ctx, osc, startTime)

        osc.start(startTime)
        osc.stop(startTime + length)
        osc.onended = onEnded
    }

    private connectToEffectsChainAndOutput(
        ctx: AudioContext,
        node: AudioNode,
        time: number
    ) {
        const filter = new BiquadFilterNode(ctx)
        filter.type = 'highshelf'
        filter.frequency.setValueAtTime(this.filterFreq, time)
        filter.gain.setValueAtTime(-6, time)
        node.connect(filter)

        const gainNode = new GainNode(ctx)
        gainNode.gain.setValueAtTime(this.gain, time)
        filter.connect(gainNode)
        gainNode.connect(ctx.destination)
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
