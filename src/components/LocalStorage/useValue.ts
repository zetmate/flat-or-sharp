import { useContext, useMemo } from 'react'
import { ValuesContext } from './context/ValuesContext.tsx'
import { LSValue } from './LSValue.ts'

interface UseValueReturnType<T> {
    value: T
    updateValue: (newValue: Partial<T>) => void
}

export function useValue<T>(lsValue: LSValue<T>): UseValueReturnType<T> {
    const id = lsValue.id
    const { updateValue, initializedValues } = useContext(ValuesContext)

    if (!initializedValues.has(id)) {
        throw new Error(
            `[useValue ${id}]: component not wrapped with WithValue`
        )
    }

    const value = initializedValues.get(id)

    return useMemo(
        () => ({
            updateValue: (newValue) => {
                if (typeof value === 'object') {
                    updateValue(id, { ...value, ...newValue })
                } else {
                    updateValue(id, value)
                }
            },
            value: value as T,
        }),
        [id, value, updateValue]
    )
}
