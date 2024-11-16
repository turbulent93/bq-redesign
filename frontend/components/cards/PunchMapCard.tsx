import { PromoDto, PunchMapPromoDto } from "@/services/client"
import { promosClient } from "@/services/services"
import { Box, Flex, Grid, Text } from "@chakra-ui/react"
import { useMemo } from "react"
import { IoCheckmark } from "react-icons/io5"
import { SlPresent } from "react-icons/sl"
import { useQuery } from "react-query"

type PunchMapCardProps = {
    columnsCount: number
    stepsCount: number
    items?: PunchMapPromoDto[]
    setItems?: (value: PunchMapPromoDto[]) => void
    onOpen?: (value: PunchMapPromoDto) => void
    promos?: PromoDto[]
}

export const PunchMapCard = ({columnsCount, stepsCount, items, setItems, onOpen}: PunchMapCardProps) => {
    const lastStep = 0 //useMemo(() => items ? items.reduce((p, c) => c.step > p ? c.step : p, 0) : 0, [items])

    return <>
        <Box
            bgGradient='linear(to-br, gray.700, red.500)'
            borderRadius={"md"}                
            p={4}
            pt={8}
            color={"white"}
            minW="100%"
        >
            <Grid
                templateColumns={`repeat(${columnsCount}, 1fr)`}
                gap={2}
                mt={4}
            >
                {
                    Array.from(Array(stepsCount).keys()).map(i => <Flex key={i} alignItems={"center"} flexDir={"column"} h={"80px"}>
                        <Flex
                            borderRadius={"100%"}
                            border={i + 1 > lastStep ? "1px" : undefined}
                            borderColor={"gray.200"}
                            w="40px"
                            h="40px"
                            justifyContent={"center"}
                            alignItems={"center"}
                            bgColor={lastStep >= i + 1 ? "gray.700" : undefined}
                            color={lastStep >= i + 1 ? "green.400" : undefined}
                            onClick={() => onOpen?.(items?.find(p => p.step == i + 1) || {step: i + 1} as PunchMapPromoDto)}
                        >
                            {
                                lastStep >= i + 1 ? <IoCheckmark size={26} /> : items?.some(p => p.step == i + 1) ? <SlPresent size={20} /> : i + 1
                            }
                        </Flex>
                    </Flex>)
                }
            </Grid>
            <Flex>
                <Box mx={"auto"}>
                    {
                        items?.sort((a, b) => a.step - b.step).map((i, index) => <Text
                            key={index}
                            fontSize={12}
                            mb={2}
                        >
                            *{i.step} - {i.promo?.description}
                        </Text>)
                    }
                </Box>
            </Flex>
        </Box>
    </> 
}