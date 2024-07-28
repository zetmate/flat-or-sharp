export interface LocalStorageValue<T> {
    readonly value: T

    setValue(newValue: T): void
}

export type ValueID = string
