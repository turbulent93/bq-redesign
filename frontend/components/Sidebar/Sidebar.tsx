"use client"

import React, { useState } from 'react'
import {
    Flex,
    Text,
    IconButton,
    Divider,
    Avatar,
    Heading,
    Box,
    Collapse,
    Tooltip,
    Link
} from '@chakra-ui/react'
import { IoPawOutline } from 'react-icons/io5'
import SidebarItem from './SidebarItem'
import { routes } from './routes'
import { FaCrown } from 'react-icons/fa'
import { IoIosArrowBack } from 'react-icons/io'
import { useAuth } from '@/utils/useAuth'

const SERVER_URL = process.env.SERVER_URL!

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const {user, isAdmin} = useAuth()

    return (
        <Flex
            pos="sticky"
            left="3"
            h="97vh"
            bgColor={"gray.100"}
            boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
            borderRadius={7}
            w={isCollapsed ? "60px" : "320px"}
            flexDir="column"
            transition="all 0.2s"
            px="10px"
            display={["none", "flex"]}
        >
            <Box my={4} alignContent={"center"} textColor={"gray.600"} mx="5px">
                <FaCrown size={"30px"}/>
            </Box>
            <Flex
                mt="110px"
                flexDir="column"
                as="nav"
                justifyContent={"center"}
            >
                {
                    routes
                        .filter(i => i.protected ? isAdmin : true)
                        .map(i => <SidebarItem isCollapsed={isCollapsed} item={i} key={i.title} />)
                }
                <Tooltip label={"Открыть"} placement='right' bgColor={"gray.600"} hasArrow isDisabled={!isCollapsed}>
                    <Link
                        borderRadius={8}
                        _hover={{ textDecor: 'none', backgroundColor: "gray.300" }}
                        // p="10px"
                        w="100%"
                        h="40px"
                        textColor={"gray.600"}
                        cursor={"pointer"}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    >
                        <Flex textColor={"gray.600"} whiteSpace={"nowrap"} alignItems={"center"} w="100%" h="100%">
                            <Box ml="10px" transform={isCollapsed ? "rotate(180deg)" : undefined}>
                                <IoIosArrowBack size={20}/> 
                            </Box>
                            <Text ml={4} display={isCollapsed ? "none" : undefined}>Закрыть</Text>
                        </Flex>
                    </Link>
                </Tooltip>

            </Flex>

            <Flex
                flexDir="column"
                h="100%"
                mb={4}
                justifyContent={"end"}
            >
                <Divider />
                <Link href="/dashboard/profile">
                    <Flex>
                        <Avatar
                            src={`${SERVER_URL}/${user?.employee?.file?.path}`}
                            w="40px"
                            h="40px"
                        />
                        <Flex flexDir="column" ml={4}>
                            <Heading
                                as="h3"
                                fontSize={"15px"}
                                whiteSpace={"nowrap"}
                            >{user?.employee?.fullName || user?.login}</Heading>
                            <Text
                                color="gray"
                                fontSize={"12px"}
                            >{user?.role}</Text>
                        </Flex>
                    </Flex>
                </Link>
            </Flex>
        </Flex>
    )
}