import { ValueID } from './types.ts'

export interface LSValue<T> {
    id: ValueID
    __type?: T
}

export function createLSValue<T>(valueID: ValueID): LSValue<T> {
    return {
        id: valueID,
    }
}
