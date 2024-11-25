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

function useWindowSize() {
	const [windowSize, setWindowSize] = useState<number>();
  
	const handler = () => setWindowSize(window.innerHeight)

	useEffect(() => {
	  	window.addEventListener("resize", handler)

		handler()

	  	return () => window.removeEventListener("resize", handler);
	}, [])

	return windowSize;
}

export const Content = ({children, type = "login"} : {children: React.ReactNode, type: "register" | "login"}) => {
	const {isAuth, isLoading, isAdmin, user} = useAuth()
    const pathname = usePathname()
	const vh = useWindowSize()

	if(isLoading) {
		return <Flex w="100vw" h="100vh" alignItems={"center"} justifyContent={"center"}>
			<Spinner />
		</Flex>
	}

	if(!isAuth) {
		return <LoginForm type={type} />
	}

	// if((pathname.includes("users") && !isAdmin)
	// 	|| (pathname.includes("dashboard") && user?.role == "Клиент"))
	// {
	// 	return <Text fontSize={24} fontWeight={"bold"} color={"gray.600"} mt={14} textAlign={"center"}>
	// 		Страница не найдена
	// 	</Text>
	// }

	if(type != "login") return children

	return <Container
		h={`${vh}px`}
		// overflowY="hidden"
		// minH="100%"
		// overflow={"hidden"}
		minHeight={"100vh"}
		p={0}
		overflow={"hidden"}
	>
		{/* <Sidebar /> */}
		<Box w="100%" overflowY={"auto"} pt={"80px"} pb={"76px"}>
			{children}
		</Box>
		<MobileNavigation />
	</Container>
}