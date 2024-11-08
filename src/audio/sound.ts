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

// TODO: re-write to a set of functions
class Sound {
    private readonly gain = 0.5
    private readonly reverbGain = 0.1
    private readonly filterFreq = 2_000
    private readonly baseOsc: OscType = 'sine'
    private readonly diffOsc: OscType = 'square'
    private fadeInLength = 0.1
    private playDelay = 0.25
    private closeDelay = 0.25
    private fadeOutLength = 0.025
    private oscLength = 1
    private timeShift = 1

    async playTwoNotes({ base, cents, flatOrSharp }: PlayTwoNotesOptions) {
        const { ctx, closeContext, playPromise } = await this.prepareForPlay(2)

        const startTime = ctx.currentTime + this.playDelay
        const baseHz = noteToHz(base)
        const diffHz = getDetunedHzFromNote(base, cents, flatOrSharp)

        // play base
        this.play(
            ctx,
            {
                startTime,
                length: this.oscLength + this.timeShift,
                hz: baseHz,
                oscType: this.baseOsc,
            },
            closeContext
        )

        // play diff
        this.play(
            ctx,
            {
                startTime: startTime + this.timeShift,
                length: this.oscLength,
                hz: diffHz,
                oscType: this.diffOsc,
            },
            closeContext
        )

        return playPromise
    }

    getRandomQuizQuestion(): QuizQuestion {
        return {
            flatOrSharp: this.getRandomFlatSharp(),
            note: this.getRandomNote(),
            octave: this.getRandomOctave(),
        }
    }

    private getRandomFlatSharp(): FlatOrSharp {
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
        { length, hz, oscType, reverb, startTime }: PlayOptions,
        onEnded: () => void
    ) {
        const osc = new OscillatorNode(ctx, {
            type: oscType,
            frequency: hz,
        })
        this.connectToEffectsChainAndOutput(ctx, osc, startTime, length, reverb)

        osc.start(startTime)
        osc.stop(startTime + length)
        osc.onended = onEnded
    }

    private connectToEffectsChainAndOutput(
        ctx: AudioContext,
        node: AudioNode,
        time: number,
        length: number,
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
        gainNode.gain.setValueAtTime(0, time)
        gainNode.gain.linearRampToValueAtTime(
            this.gain,
            time + this.fadeInLength
        )
        gainNode.gain.linearRampToValueAtTime(
            0,
            time + length - this.fadeOutLength
        )

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

    private warmUpAudioContext(ctx: AudioContext) {
        let resolveWarmup = () => {}
        const warmupPromise = new Promise<void>((resolve) => {
            resolveWarmup = resolve
        })

        const buffer = ctx.createBuffer(1, 1, ctx.sampleRate)
        const emptySource = ctx.createBufferSource()
        emptySource.buffer = buffer
        emptySource.connect(ctx.destination)
        emptySource.start(0)
        emptySource.stop(ctx.currentTime + 0.5)
        emptySource.onended = resolveWarmup

        return warmupPromise
    }

    private async prepareForPlay(
        soundSourcesCount: number,
        withReverb?: boolean
    ) {
        let resolvePlay = () => {}
        const playPromise = new Promise<void>((resolve) => {
            resolvePlay = resolve
        })

        const ctx = new AudioContext()
        const reverb = withReverb ? await this.createReverbNode(ctx) : null
        await this.warmUpAudioContext(ctx)

        const handleClosing = () => {
            const tail = (reverb?.buffer?.duration || 0) + this.closeDelay
            setTimeout(() => {
                void ctx.close().finally(resolvePlay)
            }, tail * 1000)
        }

        // TODO: this whole thing is kinda awful, rewrite to promise base for closing contexts
        let sourcesCounter = 1
        // only close when all sources played
        const closeContext = () => {
            if (sourcesCounter === soundSourcesCount) {
                handleClosing()
            } else {
                sourcesCounter++
            }
        }
        return { ctx, closeContext, reverb, playPromise }
    }

    private async createReverbNode(ctx: AudioContext) {
        try {
            const impulseResponse = await fetch(
                './assets/impulseResponses/mediumHall.wav'
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
