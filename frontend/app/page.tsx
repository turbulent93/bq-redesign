'use client';

import { Carousel } from "@/components/Carousel/Carousel";
import { promosClient } from "@/services/services";
import { Box, Button, Container, Flex, Grid, GridItem, Image, Spinner, Text } from "@chakra-ui/react";
import { FaCrown } from "react-icons/fa";
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
	const {data, isLoading} = useQuery(
        ["get promos"],
        () => promosClient.get({}), {
			select: (data) => data.list.map(i => ({title: i.title, description: i.description, image: i.image?.path!})),
			onSuccess: (data) => console.log(data)
		}
    )

	return <Container pt={20}>
		<Flex
			bgColor={"gray.600"}
			px={4}
			py={3}
			position={"absolute"}
			// top={2}
			// right={2}
			// left={2}
			top={0}
			right={0}
			left={0}
			// borderRadius={"lg"}
			justifyContent={"space-between"}
		>
			<Flex textColor={"white"} alignItems={"center"} gap={3}>
                <FaCrown size={28}/>
				<Text fontSize={18}>
					Королева красоты
				</Text>
            </Flex>
			<Button
				// bgGradient='linear(to-br, gray.700, red.500)'
				// textColor={"white"}
			>Записаться</Button>
		</Flex>
		<Text>

		</Text>
		{	
			isLoading
				? <Spinner/>
				: <Carousel items={data!} type="cards" autoSlide/>
		}
	</Container>
}
