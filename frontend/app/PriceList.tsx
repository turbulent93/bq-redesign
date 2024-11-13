"use client"

import { Carousel } from "@/components/Carousel/Carousel";
import { ServiceGroupDto } from "@/services/client";
import { promosClient, serviceGroupClient } from "@/services/services";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, AspectRatio, Box, Button, Container, Flex, Grid, GridItem, Image, Link, Spinner, Text } from "@chakra-ui/react";
import { FaCrown, FaPhone, FaVk } from "react-icons/fa";
import { useQuery } from "react-query"

type PriceListProps = {
    items?: ServiceGroupDto[]
}

export const PriceList = ({items}: PriceListProps) => {
    if(!items)
        <Spinner textAlign={"center"}/>

    return <> 
        <Text fontSize={22} textAlign={"center"} mb={3} fontWeight={"bold"}>
            Прайс-лист
        </Text>
        <Accordion allowMultiple mb={3}>
            {
                items?.map(g => <AccordionItem key={g.id}>
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
    </>
}