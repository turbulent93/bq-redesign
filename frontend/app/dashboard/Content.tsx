"use client"

import { Box, Flex, Spinner, Text } from "@chakra-ui/react"
import { LoginForm } from "./LoginForm"
import Sidebar from "@/components/Sidebar/Sidebar"
import { MobileNavigation } from "@/components/Sidebar/MobileNavigation"
import { useAuth } from "@/utils/useAuth"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import "cropperjs/dist/cropper.css";

export const Content = ({children} : {children: React.ReactNode}) => {
	const {isAuth, isLoading, isAdmin} = useAuth()
    const pathname = usePathname()
	const [vh, setVh] = useState<number>()

	useEffect(() => {
		setVh(window.innerHeight)
		// console.log(window.innerHeight * 0.01)
	}, [])

	if(isLoading) {
		return <Flex w="100vw" h="100vh" alignItems={"center"} justifyContent={"center"}>
			<Spinner />
		</Flex>
	}

	if(!isAuth) {
		return <LoginForm />
	}

	if(pathname.includes("users") && !isAdmin) {
		return <Text fontSize={24} fontWeight={"bold"} color={"gray.600"} mt={14} textAlign={"center"}>
			Страница не найдена
		</Text>
	}

	return <Flex
		h={`${vh}px`}
		// overflowY="hidden"
	>
		{/* <Sidebar /> */}
			<Box w="100%" overflowY={"auto"} h={`calc(${vh}px - 146px)`} mt={"70px"} mb={"76px"}>
				{children}
			</Box>
		<MobileNavigation />
	</Flex>
}