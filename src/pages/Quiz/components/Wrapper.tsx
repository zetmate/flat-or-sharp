import React, { PropsWithChildren } from 'react'
import { Flex } from '@radix-ui/themes'

export const Wrapper = React.memo<PropsWithChildren>(({ children }) => {
    return (
        <Flex justify="center" py="9" height="100%">
            <Flex direction="column" gap="2" maxWidth="700px">
                {children}
            </Flex>
        </Flex>
    )
})
