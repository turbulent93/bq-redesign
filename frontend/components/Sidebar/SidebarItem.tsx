import React from 'react'
import {
    Flex,
    Text,
    Icon,
    Link,
    Menu,
    MenuButton,
    MenuList,
    Box,
    Tooltip
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { usePathname } from 'next/navigation';
import { RouteType } from './routes';

type SidebarItem = {
    item: RouteType
    isCollapsed: boolean
}

export default function SidebarItem({ item: {Icon, title, href}, isCollapsed }: SidebarItem) {
    const pathname = usePathname()

    return <Tooltip label={title} placement='right' bgColor={"gray.600"} hasArrow isDisabled={!isCollapsed}>
        <Link
            borderRadius={8}
            _hover={{ textDecor: 'none', backgroundColor: "gray.300" }}
            w={"100%"}
            h="40px"
            mb={2}
            bgColor={pathname.includes(href) ? "gray.300" : undefined}
            href={href}
        >
            <Flex textColor={"gray.600"} whiteSpace={"nowrap"} alignItems={"center"} w="100%" h="100%">
                <Box ml={"10px"}>
                    <Icon size={20}/>
                </Box>
                <Text ml={4} display={isCollapsed ? "none" : undefined}>{title}</Text>
            </Flex>
        </Link>
    </Tooltip>
}