import { Carousel } from "@/components/Carousel/Carousel";
import { promosClient, serviceGroupClient } from "@/services/services";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, AspectRatio, Box, Button, Container, Flex, Grid, GridItem, Image, Link, Spinner, Text } from "@chakra-ui/react";
import { FaCrown, FaPhone, FaVk } from "react-icons/fa";
import { useQuery } from "react-query";
import { PriceList } from "./PriceList";

export const Hero = () => {
    return <Flex
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
}