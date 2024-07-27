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

interface PlayOptions {
    startTime: number
    length: number
    hz: number
    oscType: OscType
    reverb?: ConvolverNode | null
}

class Sound {
    gain = 0.5
    reverbGain = 0.1
    filterFreq = 2_000
    private baseOsc: OscType = 'sine'
    private diffOsc: OscType = 'square'

    async playOneNote(options: PlayOneNoteOptions) {
        const { ctx, closeContext, reverb } = await this.prepareForPlay(1)
        void this.play(
            ctx,
            {
                startTime: ctx.currentTime,
                length: 1,
                oscType: options.oscType,
                hz: noteToHz(options),
                reverb,
            },
            closeContext
        )
    }

    async playTwoNotes({
        base,
        cents,
        flatOrSharp,
        timeShift = 1,
    }: PlayTwoNotesOptions) {
        const { ctx, closeContext, reverb } = await this.prepareForPlay(2)

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
                reverb,
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
                reverb,
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
        { startTime, length, hz, oscType, reverb }: PlayOptions,
        onEnded: () => void
    ) {
        const osc = new OscillatorNode(ctx, {
            type: oscType,
            frequency: hz,
        })
        this.connectToEffectsChainAndOutput(ctx, osc, startTime, reverb)

        osc.start(startTime)
        osc.stop(startTime + length)
        osc.onended = onEnded
    }

    private connectToEffectsChainAndOutput(
        ctx: AudioContext,
        node: AudioNode,
        time: number,
        reverb?: ConvolverNode | null
    ) {
        // Filter
        const filter = new BiquadFilterNode(ctx)
        filter.type = 'highshelf'
        filter.frequency.setValueAtTime(this.filterFreq, time)
        filter.gain.setValueAtTime(-6, time)

        // Connect 1
        node.connect(filter)

        // Gain
        const gainNode = new GainNode(ctx)
        gainNode.gain.setValueAtTime(this.gain, time)

        // Connect 2
        filter.connect(gainNode)

        // OUTPUT DRY
        gainNode.connect(ctx.destination)

        if (reverb) {
            // Connect 3
            gainNode.connect(reverb)

            // Reverb gain
            const reverbGainNode = new GainNode(ctx)
            reverbGainNode.gain.setValueAtTime(this.reverbGain, time)

            // Connect 4
            reverb.connect(reverbGainNode)

            // OUTPUT WET
            reverbGainNode.connect(ctx.destination)
        }
    }

    // TODO: this whole thing is kinda awful, rewrite to promise base for closing contexts
    private async prepareForPlay(soundSourcesCount: number) {
        const ctx = new AudioContext()
        const reverb = await this.createReverbNode(ctx)
        let counter = 1

        const handleClosing = () => {
            const reverbDuration = reverb?.buffer?.duration
            if (reverbDuration) {
                setTimeout(
                    () => {
                        void ctx.close()
                    },
                    reverbDuration * 1000 + 100
                )
            } else {
                void ctx.close()
            }
        }

        // only close when both osc played
        const closeContext = () => {
            if (counter === soundSourcesCount) {
                handleClosing()
            } else {
                counter++
            }
        }
        return { ctx, closeContext, reverb }
    }

    private async createReverbNode(ctx: AudioContext) {
        try {
            const impulseResponse = await fetch(
                './src/audio/impulseResponses/mediumHall.wav'
            )
            const arrayBuffer = await impulseResponse.arrayBuffer()
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
            const convolver = ctx.createConvolver()
            convolver.buffer = audioBuffer

            return convolver
        } catch (err) {
            console.error('[Sound]: failed to create reverb node', err)
            return null
        }
    }
}

export const sound = new Sound()
