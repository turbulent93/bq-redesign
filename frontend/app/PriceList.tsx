"use client"

import { Carousel } from "@/components/Carousel/Carousel";
import { ServiceDto, ServiceGroupDto } from "@/services/client";
import { promosClient, serviceGroupClient } from "@/services/services";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, AspectRatio, Box, Button, Container, Flex, Grid, GridItem, Image, Link, Spinner, Text } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { FaCrown, FaPhone, FaVk } from "react-icons/fa";
import { useQuery } from "react-query"

type PriceListProps = {
    items?: ServiceGroupDto[]
    onClick?: (value: ServiceDto) => void
    viewTitle?: boolean
}

export const PriceList = ({items, onClick, viewTitle = true}: PriceListProps) => {
    if(!items)
        <Spinner textAlign={"center"}/>

    return <> 
        {
            viewTitle && <Text fontSize={22} textAlign={"center"} mb={3} fontWeight={"bold"}>
                Прайс-лист
            </Text>
        }
        <Accordion allowMultiple mb={8}>
            {
                items?.map(g => <AccordionItem
                    key={g.id}
                    borderRadius={"md"}
                    border={"1px"}
                    borderColor={"gray.300"}
                    mb={1}
                >
                    <AccordionButton>
                        <Flex
                            justifyContent={"space-between"}
                            w="100%"
                            alignItems={"center"}
                        >
                            <Text
                                fontSize={20}
                                fontWeight={"bold"}
                            >
                                {g.name}
                            </Text>
                            <AccordionIcon />
                        </Flex>
                    </AccordionButton>
                    <AccordionPanel>
                        {
                            g.services?.map(s => <Flex
                                    justifyContent={"space-between"}
                                    key={s.id}
                                    mb={2}
                                    // position={"relative"}
                                    alignItems={"center"}
                                >
                                <Box>
                                    <Text
                                        fontSize={16}
                                        fontWeight={"bold"}
                                        mb={2}
                                    >
                                        {s.name}
                                    </Text>
                                    <Flex>
                                        <Text>
                                            {s.price}р
                                        </Text>
                                        {
                                            s.bonusCount > 0 && <Box
                                                fontSize={12}
                                                // position={"absolute"}
                                                // top={-1}
                                                // right={-1}
                                                ml={2}
                                                bgColor={"gray.700"}
                                                color={"white"}
                                                px={2}
                                                py={1}
                                                borderRadius={"md"}
                                                shadow={"lg"}
                                                zIndex={10}
                                            >
                                                +{s.bonusCount} бонусов
                                            </Box>
                                        }
                                    </Flex>
                                </Box>
                                <Button onClick={() => onClick?.(s)}>
                                    {
                                        onClick ? <Text>Записаться</Text>
                                        : <Link href={`/appointment?serviceId=${s.id}`}>
                                            Записаться
                                        </Link>
                                    }
                                </Button>
                            </Flex>)
                        }
                    </AccordionPanel>
                </AccordionItem>)
            }
        </Accordion>
    </>
}