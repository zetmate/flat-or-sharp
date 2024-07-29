export const getIntervalLabel = (cents: number) => {
    if (cents < 100) {
        return `${cents} cents`
    }
    return `${cents / 100} semitones`
}
