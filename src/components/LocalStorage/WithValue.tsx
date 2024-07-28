import React, {
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from 'react'
import { ValueID } from './types.ts'
import { ValuesContext } from './context/ValuesContext.tsx'

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
    const { initValue } = useContext(ValuesContext)
    const [value, setValue] = useState<T | typeof UNSET_VALUE>(UNSET_VALUE)

    useEffect(() => {
        const savedValue = initValue(id)
        setValue((savedValue as T) || defaultValue)
    }, []) // onMount, dont add deps

    if (value === UNSET_VALUE) {
        return fallback
    }
    return children
})
