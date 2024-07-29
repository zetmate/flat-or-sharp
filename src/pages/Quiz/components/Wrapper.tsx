import React, { PropsWithChildren, useContext } from 'react'
import { Button, Flex, Heading } from '@radix-ui/themes'
import { QuizContext } from '../context/QuizContext.ts'
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'

interface Props extends PropsWithChildren {
    title: string
}

export const Wrapper = React.memo<Props>(({ children, title }) => {
    const { quit, next, state } = useContext(QuizContext)
    const headerIcon = (
        <>
            {state === 'right' && (
                <CheckIcon color="green" width="40" height="40" />
            )}
            {state === 'wrong' && (
                <Cross2Icon color="red" width="40" height="40" />
            )}
        </>
    )
    return (
        <Flex justify="center" py="9" height="100%">
            <Flex direction="column" gap="6" maxWidth="700px">
                {state !== 'not-started' && state !== 'completed' && (
                    <Flex justify="between" gap="6">
                        <Button color="red" variant="ghost" onClick={quit}>
                            Quit
                        </Button>
                        {(state === 'right' || state === 'wrong') && (
                            <Button variant="ghost" onClick={next}>
                                Next
                            </Button>
                        )}
                    </Flex>
                )}
                <Flex justify="center" gap="1" align="center">
                    {headerIcon}
                    <Heading as="h2" size="6">
                        {title}
                    </Heading>
                    {headerIcon}
                </Flex>
                <Flex direction="column" gap="3">
                    {children}
                </Flex>
            </Flex>
        </Flex>
    )
})
