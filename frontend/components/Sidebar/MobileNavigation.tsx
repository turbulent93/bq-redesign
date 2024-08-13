"use client"

import { Avatar, Box, Flex, Heading, Link, Text } from "@chakra-ui/react"
import { routes } from "./routes"
import { usePathname } from "next/navigation"
import { FaCrown } from "react-icons/fa"
import { useAuth } from "@/utils/useAuth"

const SERVER_URL = process.env.SERVER_URL!

export const MobileNavigation = () => {
    const pathname = usePathname()
    const {user, isAdmin} = useAuth()

    return <>
        <Flex
            display={["flex", "none"]} 
            pos="absolute"
            top={0}
            w="100%"
            bgColor={"gray.100"}
            alignItems={"center"}
            justifyContent={"space-between"}
            py={2}
            px={6}
            borderBottomRadius={"10px"}
            h="60px"
        >
            <Box textColor={"gray.600"}>
                <FaCrown size={30}/>
            </Box>
            {
                pathname !== "/dashboard/profile" && <Link
                    href="/dashboard/profile"
                    _hover={{
                        textDecor: "none"
                    }}
                    >
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
            }
        </Flex>
        <Flex
        display={["flex", "none"]} 
            pos="absolute"
            bottom={0}
            w="100%"
            bgColor={"gray.100"}
            justifyContent={"center"}
            borderTopRadius={"10px"}
            gap={4}
            h="66px"
            px={2}
        >
            {
                routes
                    .filter(i => i.protected ? isAdmin : true)
                    .map(({Icon, href, title}) => <Link
                        borderRadius={8}
                        _hover={{ textDecor: 'none', backgroundColor: "gray.300" }}
                        w={"40px"}
                        h="40px"
                        my={3}
                        bgColor={pathname.includes(href) ? "gray.300" : undefined}
                        href={href}
                        key={href}
                    >
                        <Flex textColor={"gray.600"} alignItems={"center"} justifyContent="center" w="100%" h="100%">
                            <Icon size={26}/>
                        </Flex>
                    </Link>)
            }
        </Flex>
    </>
}