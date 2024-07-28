import { Tagged } from 'type-fest'

export interface LocalStorageValue<T> {
    readonly value: T

    setValue(newValue: T): void
}

export type ValueID = Tagged<string, 'valueId'>
