"use client"

import { Avatar, Box, Flex, Spinner, Text } from "@chakra-ui/react"
import Sidebar from "@/components/Sidebar/Sidebar"
import { MobileNavigation } from "@/components/Sidebar/MobileNavigation"
import { useAuth } from "@/utils/useAuth"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { FaCrown } from "react-icons/fa"

export const Content = ({children} : {children: React.ReactNode}) => {
	const [vh, setVh] = useState<number>()

	useEffect(() => {
		setVh(window.innerHeight * 0.01)
	}, [])

	return <Flex
		h={`calc(${vh}px * 100)`}
		overflowY="hidden"
	>
		<Sidebar />
        <Box w="100%" overflowY={"auto"} h={`calc(${vh}px * 100 - 146px)`} mt={"70px"} mb={"76px"}>
            {children}
        </Box>
        <MobileNavigation />
	</Flex>
}