'use client';

import { Carousel } from "@/components/Carousel/Carousel";
import { galleryClient, promosClient, punchMapsClient, serviceGroupClient } from "@/services/services";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, AspectRatio, Box, Button, Container, Flex, Grid, GridItem, Image, Link, Spinner, Text } from "@chakra-ui/react";
import { FaCrown, FaPhone, FaVk } from "react-icons/fa";
import { useQuery } from "react-query";
import { PriceList } from "./PriceList";
import { Hero } from "./Hero";
import { Footer } from "./Footer";
import { Gallery } from "./Gellery";
import { PromoCard } from "@/components/cards/PromoCard";
import { PunchMapCard } from "@/components/cards/PunchMapCard";

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

// const PromoItem = (props: {id?: number, title: string, description: string, image: string}) => {
// 	return <PromoCard {...props} />
// }

const SERVER_URL = process.env.SERVER_URL!

export default function Home() {
	const {data: promos, isLoading: isPromosLoading} = useQuery(
        ["get promos"],
        () => promosClient.get({}), {
			select: (data) => data.list.map(i => {
				const PromoItem = () => {
					return <PromoCard {...i} image={`${SERVER_URL}/${i.image?.path}`} key={i.id}/>
				}

				return PromoItem
			}),
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

	const {data: punchMaps, isLoading} = useQuery(
        ["get punch-maps"],
        () => punchMapsClient.get({page: undefined, size: undefined}), {
			select: (data) => data.list.map(i => {
				const PunchMapItem = () => {
					return <PunchMapCard {...i} items={i.punchMapPromos}/>
				}

				return PunchMapItem
			})
		}
    )

	if(isPromosLoading || isServiceGroupsLoading || isGalleryLoading)
		<Spinner/>

	return <Box>
		<Hero />
		<Container mt={4}>
			<Carousel items={promos} autoSlide/>
			<PriceList items={serviceGroups} />
			<Text fontSize={22} textAlign={"center"} mb={3} fontWeight={"bold"}>
				Получайте скидки за посещение!
			</Text>
			<Carousel items={punchMaps} autoSlide />
			<Gallery items={gallery} />
		</Container>
		<Footer />
	</Box>
}
