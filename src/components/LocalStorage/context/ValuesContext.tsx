import React from 'react'
import { ValueID } from '../types.ts'

export interface ValuesContextType {
    initializedValues: Map<ValueID, unknown>
    initValue: (id: ValueID) => unknown
    updateValue: (id: ValueID, newValue: unknown) => void
}

const uninitializedMethod = () => {
    throw new Error('[ValuesContext]: no provider found')
}

export const ValuesContext = React.createContext<ValuesContextType>({
    initializedValues: new Map(),
    initValue: uninitializedMethod,
    updateValue: uninitializedMethod,
})
