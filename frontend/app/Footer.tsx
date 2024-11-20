import { Carousel } from "@/components/Carousel/Carousel";
import { promosClient, serviceGroupClient } from "@/services/services";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, AspectRatio, Box, Button, Container, Flex, Grid, GridItem, Image, Link, Spinner, Text } from "@chakra-ui/react";
import { FaCrown, FaPhone, FaVk } from "react-icons/fa";
import { useQuery } from "react-query";
import { PriceList } from "./PriceList";
import { Hero } from "./Hero";

export const Footer = ({showMap = true}: {showMap?: boolean}) => {
    return  <>
        <Box position={"relative"} overflow={"hidden"}>
			{
				showMap ? <iframe
					src="https://yandex.ru/map-widget/v1/org/koroleva_krasoty/1357796792/?ll=65.329997%2C55.444048&z=17"
					allowFullScreen
					width="100%"
					height={300}
				/> : <Flex
					justifyContent={"center"}
					alignItems={"center"}
					h={300}
					borderTop={"1px"}
					borderColor={"gray.300"}
				>
					<Text
						fontSize={22}
						fontWeight={"bold"}
					>
						Карта
					</Text>
				</Flex>
			}
		</Box>
		<Flex justifyContent={"center"} gap={4} alignItems={"center"} bgColor={"gray.700"} py={6} color="white">
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
    </>
}