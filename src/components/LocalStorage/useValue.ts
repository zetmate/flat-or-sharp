import { ValueID } from './types.ts'
import { useMemo } from 'react'
import { useValuesContext } from './context/ValuesContext.tsx'

interface UseValueReturnType<T> {
    value: T
    updateValue: (newValue: T) => void
}

export function useValue<T>(id: ValueID): UseValueReturnType<T> {
    const { updateValue, initializedValues } = useValuesContext()

    if (!initializedValues.has(id)) {
        throw new Error(
            `[useValue ${id}]: component not wrapped with WithValue`
        )
    }

    const value = initializedValues.get(id)

    return useMemo(
        () => ({
            updateValue: (newValue) => updateValue(id, newValue),
            value: value as T,
        }),
        [id, value, updateValue]
    )
}
