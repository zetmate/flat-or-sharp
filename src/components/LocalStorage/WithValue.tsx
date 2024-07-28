import React, {
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from 'react'
import { ValuesContext } from './context/ValuesContext.tsx'
import { LSValue } from './LSValue.ts'

export interface WithValueProps<T> extends PropsWithChildren {
    defaultValue: T
    lsValue: LSValue<T>
    fallback?: React.ReactNode
}

export function WithValue<T>({
    children,
    lsValue,
    defaultValue,
    fallback = 'Loading...',
}: WithValueProps<T>) {
    const id = lsValue.id
    const { initValue } = useContext(ValuesContext)
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        initValue(id, defaultValue)
        setIsInitialized(true)
    }, []) // onMount, dont add deps

    if (!isInitialized) {
        return fallback
    }
    return children
}
