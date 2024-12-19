"use client"

import { Box, Container, Flex, Spinner, Text } from "@chakra-ui/react"
import { LoginForm } from "./dashboard/LoginForm"
import Sidebar from "@/components/Sidebar/Sidebar"
import { MobileNavigation } from "@/components/Sidebar/MobileNavigation"
import { useAuth } from "@/utils/useAuth"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import "cropperjs/dist/cropper.css";
import { ProfileHeader } from "./profile/ProfileHeader"

export function useWindowSize() {
	const [windowSize, setWindowSize] = useState<{w?: number, h?: number}>({});
  
	const handler = () => setWindowSize({w: window.innerWidth, h: window.innerHeight})

	useEffect(() => {
	  	window.addEventListener("resize", handler)

		handler()

	  	return () => window.removeEventListener("resize", handler);
	}, [])

	return windowSize;
}

export const Content = ({children, type} : {children: React.ReactNode, type: "dashboard" | "client"}) => {
	const {isAuth, isLoading, isAdmin, user} = useAuth()
    const pathname = usePathname()
	const {h: vh} = useWindowSize()

	if(isLoading) {
		return <Flex w="100vw" h="100vh" alignItems={"center"} justifyContent={"center"}>
			<Spinner />
		</Flex>
	}

	if(!isAuth) {
		return <LoginForm type={type} />
	}

	if((pathname.includes("users") && !isAdmin)
		|| (pathname.includes("dashboard") && user?.role == "Клиент"))
	{
		return <Text fontSize={24} fontWeight={"bold"} color={"gray.600"} mt={14} textAlign={"center"}>
			Страница не найдена
		</Text>
	}

	if(type != "dashboard") return children

	return <>
	<Container
		h={`${vh}px`}
		// overflowY="hidden"
		// minH="100%"
		// overflow={"hidden"}
		// minHeight={"100vh"}
		p={0}
		// overflow={"hidden"}
		position={"relative"}
		// bgColor={"gray.300"}
		pt={"80px"}
		maxW="1100px"
	>
		{/* <Sidebar /> */}
		<Box
			h={vh ? `${vh - 156}px` : undefined}
			w="100%"
			overflowY={"auto"}
			// mt={"80px"}
			// pb={"76px"}
		>
			{children}
		</Box>
		<MobileNavigation />
	</Container>
	</>
}