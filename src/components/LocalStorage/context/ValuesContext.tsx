import React, {
    PropsWithChildren,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import { ValueID } from '../types.ts'

interface ValuesContextType {
    initializedValues: Map<ValueID, unknown>
    initValue: (id: ValueID) => unknown
    updateValue: (id: ValueID, newValue: unknown) => void
}

const uninitializedMethod = () => {
    throw new Error('[ValuesContext]: no provider found')
}

const ValuesContext = React.createContext<ValuesContextType>({
    initializedValues: new Map(),
    initValue: uninitializedMethod,
    updateValue: uninitializedMethod,
})

export const useValuesContext = () => useContext(ValuesContext)

export const ValuesContextProvider = ({ children }: PropsWithChildren) => {
    const [initializedValues, setInitializedValues] = useState<
        ValuesContextType['initializedValues']
    >(new Map())

    const initValue: ValuesContextType['initValue'] = useCallback(
        (valueId) => {
            if (initializedValues.has(valueId)) {
                return initializedValues.get(valueId)
            }
            const raw = localStorage.getItem(valueId)
            const parsed = raw && JSON.parse(raw)

            setInitializedValues((prevState) => {
                const updated = new Map(prevState)
                updated.set(valueId, parsed)
                return updated
            })
        },
        [initializedValues]
    )

    const updateValue: ValuesContextType['updateValue'] = useCallback(
        (valueId: ValueID, newValue: unknown) => {
            if (!initializedValues.has(valueId)) {
                throw new Error(
                    `[ValuesContext]: attempt to set uninitialized value ${valueId}`
                )
            }
            setInitializedValues((prevState) => {
                localStorage.setItem(valueId, JSON.stringify(newValue))
                const updated = new Map(prevState)
                updated.set(valueId, newValue)
                return updated
            })
        },
        [initializedValues]
    )

    const contextValue: ValuesContextType = useMemo(
        () => ({
            initializedValues,
            initValue,
            updateValue,
        }),
        [initializedValues, initValue, updateValue]
    )

    return (
        <ValuesContext.Provider value={contextValue}>
            {children}
        </ValuesContext.Provider>
    )
}
