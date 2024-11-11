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
                .map((i: PromoServiceDto, index) => <Flex
                    key={i.id || index}
                    border={"1px"}
                    borderColor={"gray.600"}
                    borderStyle={"dashed"}
                    borderRadius={12}
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
                            {
                                `${services?.find(s => s.id == i.serviceId)!?.price - i.discount}р (-${i.discount}р)`
                                // services?.find(s => s.id == i.serviceId)!?.price - (i.unit == "%"
                                //     ? (services?.find(s => s.id == i.serviceId)?.price! / 100) * i.discount
                                //     : i.discount)
                            }
                        </Text>
                    </Box>
                    <Flex justifyContent={"center"}>
                        <Button
                            color={"gray.400"}
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
                                    color={"red.400"} 
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
                                            ...items.filter(s => !(s.discount == i.discount && s.serviceId == i.serviceId && s.unit == i.unit))
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
        {
            items.length > 0 && <Text fontSize={18}>
                Скидка всего - {
                    items.reduce((c, s) => c + Number(s.discount), 0)
                }р, -{
                    Math.floor((items.reduce((c, s) => c + Number(s.discount), 0) / items.reduce((c, s) => services?.find(i => i.id == s.serviceId)?.price! + c, 0)) * 100)
                }% от суммы
            </Text>
        }
    </Box>
}