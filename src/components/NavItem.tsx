import { TabNav } from '@radix-ui/themes'
import { useLocation, matchPath } from 'react-router-dom'

interface NavItemProps {
    routePath: string
    name: string
}

export const NavItem = ({ routePath, name }: NavItemProps) => {
    const location = useLocation()
    const isActive = !!matchPath(location.pathname, {
        exact: true,
        path: routePath,
    })

    return (
        <TabNav.Link href={routePath} active={isActive}>
            {name}
        </TabNav.Link>
    )
}
