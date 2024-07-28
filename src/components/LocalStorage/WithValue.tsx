import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ValueID } from './types.ts'
import { useValuesContext } from './context/ValuesContext.tsx'

const UNSET_VALUE = '[WithValue]__unset' as const

export interface WithValueProps<T> extends PropsWithChildren {
    defaultValue: T
    id: ValueID
    fallback?: React.ReactNode
}

export const WithValue = React.memo(function <T>({
    children,
    id,
    defaultValue,
    fallback = 'Loading...',
}: WithValueProps<T>) {
    const { initValue } = useValuesContext()
    const [value, setValue] = useState<T | typeof UNSET_VALUE>(UNSET_VALUE)

    useEffect(() => {
        const savedValue = initValue(id)
        setValue((savedValue as T) || defaultValue)
    }, [])

    if (value === UNSET_VALUE) {
        return fallback
    }
    return children
})
