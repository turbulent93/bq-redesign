'use client';

import { Carousel } from "@/components/Carousel/Carousel";
import { galleryClient, promosClient, serviceGroupClient } from "@/services/services";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, AspectRatio, Box, Button, Container, Flex, Grid, GridItem, Image, Link, Spinner, Text } from "@chakra-ui/react";
import { FaCrown, FaPhone, FaVk } from "react-icons/fa";
import { useQuery } from "react-query";
import { PriceList } from "./PriceList";
import { Hero } from "./Hero";
import { Footer } from "./Footer";
import { Gallery } from "./Gellery";

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

	const {data: gallery, isLoading: isGalleryLoading} = useQuery(
        ["get gallery", 1],
        () => galleryClient.get({page: 1, size: 6}), {
			select: (data) => data.list
		}
    )

	if(isPromosLoading || isServiceGroupsLoading || isGalleryLoading)
		<Spinner/>

	return <Box>
		<Hero />
		<Container mt={4}>
			<Carousel items={promos} type="cards" autoSlide/>
			<PriceList items={serviceGroups} />
			<Gallery items={gallery} />
		</Container>
		<Footer />
	</Box>
}
