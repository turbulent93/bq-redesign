"use client"

import { PromoDto, PromoServiceDto } from "@/services/client"
import { servicesClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { Box, Button, Flex, Link, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { BsPencilFill } from "react-icons/bs"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useQuery } from "react-query"

type PromoServicesListProps = {
    items: PromoServiceDto[]
    setItems: (value: PromoServiceDto[]) => void
    currentService?: PromoServiceDto
    setCurrentService: (value?: PromoServiceDto) => void
}

export const PromoServicesList = ({items, setItems, currentService, setCurrentService}: PromoServicesListProps) => {
    const {data: services} = useQuery(
        ["get specializations"],
        () => servicesClient.get({page: undefined, size: undefined}), {
            select: (data) => data.list
        }
    )

    return <Box>
        {
            items
                ?.map((i: PromoServiceDto, index) => <Flex
                    key={i.id || index}
                    // border={"1px"}
                    // borderColor={"gray.600"}
                    // borderStyle={"dashed"}
                    // bgColor={"gray.100"}
                    // shadow={"lg"}
                    borderRadius={"md"}
                    mb={2}
                    py={2}
                    px={4}
                    justifyContent={"space-between"}
                >
                    <Box>
                        <Text fontSize={18} fontWeight={"bold"}>
                            {
                                services?.find(s => s.id == i.serviceId)?.name
                            }
                        </Text>
                        <Text fontSize={14}>
                            {i.discount}р
                        </Text>
                    </Box>
                    <Flex justifyContent={"center"}>
                        <Button
                            // color={"gray.400"}
                            color={"white"}
                            bgColor={"gray.700"}
                            mr={2} size={"xs"}
                            _disabled={{
                                opacity: "0.5"
                            }}
                            onClick={() => setCurrentService(i)}
                        >
                            <BsPencilFill />
                        </Button>
                        <Popover closeOnBlur={true}>
                            <PopoverTrigger>
                                <Button
                                    bgColor={"red.400"} 
                                    color={"white"}
                                    size={"xs"}
                                    _disabled={{
                                        opacity: "0.5"
                                    }}
                                >
                                    <RiDeleteBin6Line/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow/>
                                <PopoverCloseButton/>
                                <PopoverHeader>
                                    Удалить?
                                </PopoverHeader>
                                <PopoverBody>
                                    <Button
                                        bgColor={"red.400"}
                                        color={"white"}
                                        _hover={{
                                            bgColor: "red.300"
                                        }}
                                        mr={2}
                                        onClick={() => setItems([
                                            ...items.filter(s => s.id != (i.id ? i.id : index))
                                        ])}
                                    >
                                        Да
                                    </Button>
                                    <Button>
                                        Отмена
                                    </Button>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </Flex>
                </Flex>)
        }
    </Box>
}