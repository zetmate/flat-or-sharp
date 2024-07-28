import React, { PropsWithChildren } from 'react'
import { Flex, Heading } from '@radix-ui/themes'

interface Props extends PropsWithChildren {
    title: string
}

export const Wrapper = React.memo<Props>(({ children, title }) => {
    return (
        <Flex justify="center" py="9" height="100%">
            <Flex direction="column" gap="6" maxWidth="700px">
                <Heading as="h2" size="6">
                    {title}
                </Heading>
                <Flex direction="column" gap="3">
                    {children}
                </Flex>
            </Flex>
        </Flex>
    )
})
