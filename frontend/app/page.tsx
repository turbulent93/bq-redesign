'use client';

import { Carousel } from "@/components/Carousel/Carousel";
import { promosClient, serviceGroupClient } from "@/services/services";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, AspectRatio, Box, Button, Container, Flex, Grid, GridItem, Image, Link, Spinner, Text } from "@chakra-ui/react";
import { FaCrown, FaPhone, FaVk } from "react-icons/fa";
import { useQuery } from "react-query";

const images = [
	{
		id: 1,
		image: "haircut.jpg"
	},
	{
		id: 2,
		image: "haircut.jpg"
	},
	{
		id: 3,
		image: "haircut.jpg"
	}
]

export default function Home() {
	const {data: promos, isLoading: isPromosLoading} = useQuery(
        ["get promos"],
        () => promosClient.get({}), {
			select: (data) => data.list.map(i => ({title: i.title, description: i.description, image: i.image?.path!})),
			// onSuccess: (data) => console.log(data)
		}
    )

	const {data: serviceGroups, isLoading: isServiceGroupsLoading} = useQuery(
        ["get service-groups"],
        () => serviceGroupClient.get({}), {
			select: (data) => data.list
			// onSuccess: (data) => console.log(data)
		}
    )

	if(isPromosLoading || isServiceGroupsLoading)
		<Spinner/>

	return <Box position={"relative"}>
	{/* <Flex
		bgColor={"red.500"}
		// borderBottom={"1px"}
		// borderBottomColor={"gray.300"}
		// opacity={"0.8"}
		px={4}
		py={3}
		position={"sticky"}
		zIndex={200}
		top={0}
		right={0}
		left={0}
		justifyContent={"end"}
		// backdropFilter='blur(10px)'
	>
		<Button
			// colorScheme="blackAlpha"
		>Войти</Button>
	</Flex> */}
	{/* <Image src="/bg.png" h="400px" w="100%" /> */}
	<Flex
		bgGradient='linear(to-br, gray.700, red.500)'
		textColor={"white"}
		h="500px"
		w="100%"
		borderBottom={"1px"}
		borderBottomColor={"gray.300"}
		alignItems={"end"}
		flexDir={"column"}
		p={4}
	>
		<Button
			w="100px"
			mb={20}
			// bgColor={"gray.600"}
			// color={"white"}
			colorScheme="blackAlpha"
		>Войти</Button>
		<Flex
			textColor={"white"}
			flexDir={"column"}
			alignItems={"center"}
			w="100%"
		>
			<FaCrown size={54}/>
			<Text fontSize={38}>
				Королева красоты
			</Text>
			<Text w="280px" textAlign={"center"}>
				Записаться можно в группе <Link
					href="https://vk.com/bq_kurgan"
					textDecor={"underline"}
				>ВКонтакте</Link>, по телефону <Link
					href="tel:89226763076"
					textDecor={"underline"}
				>89226763076</Link> или онлайн
			</Text>
			<Button mt={3}>
				Записаться
			</Button>
		</Flex>
	</Flex>
	<Container mt={4}>
		{
			promos && <Carousel items={promos} type="cards" autoSlide/>
		}
		<Text fontSize={22} textAlign={"center"} mb={3} fontWeight={"bold"}>
			Прайс-лист
		</Text>
		<Accordion allowMultiple mb={3}>
			{
				serviceGroups?.map(g => <AccordionItem key={g.id}>
					<AccordionButton>
						<Flex justifyContent={"space-between"} w="100%" alignItems={"center"}>
							<Text fontSize={20} fontWeight={"bold"}>
								{g.name}
							</Text>
							<AccordionIcon />
						</Flex>
					</AccordionButton>
					<AccordionPanel>
						{
							g.services?.map(s => <Flex justifyContent={"space-between"} key={s.id} mb={2}>
								<Box>
									<Text fontSize={16} fontWeight={"bold"} mb={2}>{s.name}</Text>
									<Text>{s.price}р</Text>
								</Box>
								<Button
									// bgGradient='linear(to-br, gray.700, red.500)'
									// textColor={"white"}
								>Записаться</Button>
							</Flex>)
						}
					</AccordionPanel>
				</AccordionItem>)
			}
		</Accordion>
	</Container>
	<Box position={"relative"} overflow={"hidden"}>
		<iframe
			src="https://yandex.ru/map-widget/v1/org/koroleva_krasoty/1357796792/?ll=65.329997%2C55.444048&z=17"
			allowFullScreen
			width="100%"
			height={300}
		/>
	</Box>
	<Flex justifyContent={"center"} gap={4} alignItems={"center"} bgColor={"gray.600"} py={6} color="white">
		<Text>ул. Станционная, 41</Text>
		<Box
			borderRadius="100%"
			bgColor={"gray.100"}
			color="gray.600"
			p={2}
		>
			<FaPhone />
		</Box>
		<Box
			borderRadius="100%"
			bgColor={"gray.100"}
			color="gray.600"
			p={2}
		>
			<FaVk size={20} />
		</Box>
	</Flex>
	</Box>
}
