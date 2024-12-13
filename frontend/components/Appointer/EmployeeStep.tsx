'use client';

import { ColumnType, CustomTable } from "@/components/Table/Table";
import { AppointmentDto, ServiceDto, UpcomigAppointment, UserDto } from "@/services/client";
import { usersClient } from "@/services/services";
import { DATE_FORMAT } from "@/utils/constants";
import { nameof } from "@/utils/nameof";
import { Avatar, Box, Button, Container, Flex, Spacer, Spinner, Text } from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { AiOutlineSchedule } from "react-icons/ai";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "react-query";

const SERVER_URL = process.env.SERVER_URL!

type EmployeeStepProps = {
    goToNext: () => void
    goBack: () => void
    goToPhone: () => void
    duration?: number
}


const weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]

const getUpcomingDate = (items: UpcomigAppointment[]) => {
    const date = moment(items[0].date, DATE_FORMAT)
    const diff = moment().diff(date, "days")

    if(diff == 0) {
        return "сегодня"
    } else if(diff == 1) {
        return "завтра"
    } else {
        return `${date.date()}.${date.month() + 1}, ${weekDays[date.weekday() - 1]}`
    }
}

export default function EmployeeStep({goToNext, goBack, goToPhone, duration}: EmployeeStepProps) {
    const {setValue, watch} = useFormContext()

    const serviceId = watch(nameof<AppointmentDto>("serviceId"))

    const [page, setPage] = useState<number>(1)
    const {data, isLoading} = useQuery(
        ["get employees", page, serviceId],
        () => usersClient.get({page: page, size: 10, withUpcomingAppointments: true, duration, serviceId}), {
            enabled: !!serviceId && !!duration
        }
    )

    if(!serviceId) {
        return <Flex
            w="100%"
            justifyContent={"center"}
            alignItems="center"
            cursor={"pointer"}
            gap={2}
        >
            <Text
                _hover={{textDecoration: "underline"}} 
                onClick={goBack}
            >
                Сначала выберите услугу
            </Text>
            <FaExternalLinkAlt />
        </Flex>
    }

    if(data?.list.length == 0 && !isLoading) {
        return <Text textAlign={"center"} fontWeight={"bold"}>Нет свободных мастеров</Text>
    }

    if(data?.list.length == 0 && isLoading) {
        return <Spinner mx="auto" />
    }

    return (
        <Box>
            {
                data?.list.map(i => <Box
                        key={i.id}
                        // bgColor={"gray.700"}
                        p={3}
                        shadow={"lg"}
                        border={"1px"}
                        borderColor={"gray.300"}
                        borderRadius={"md"}
                        mb={3}
                        // maxW={"326px"}
                    >
                    <Flex mb={2} alignItems={"start"}>
                        <Avatar
                            src={`${SERVER_URL}/${i.avatar?.path}`}
                            // w="30px"
                            // h="30px"
                            mr={2}
                        />
                        <Box w="100%" position={"relative"}>
                            <Text color={"gray.700"} fontSize={20}>
                                {i.fullName}
                            </Text>
                            {/* <Box position={"relative"}> */}
                            <Text
                                position={"absolute"}
                                left={0}
                                right={0}
                                bottom={-5}
                                color={"gray.500"} 
                                whiteSpace={"nowrap"}
                                textOverflow={"ellipsis"}
                                overflow={"hidden"}
                                // maxW={"80%"}
                            >
                                {i.specializations?.map(s => s.name).join(", ")}
                                </Text>
                            {/* </Box> */}
                        </Box>
                        {/* <Button
                            leftIcon={<AiOutlineSchedule size={20} />}
                            ml={2}
                        >

                        </Button> */}
                    </Flex>
                    <Flex mb={2}>
                        <Text>
                            Ближайшее время на
                        </Text>
                        <Text fontWeight={"bold"} ml={1}>{getUpcomingDate(i.upcomingAppointments)}</Text>
                    </Flex>
                    <Flex gap={3} flexWrap={"wrap"}>
                        {
                            i.upcomingAppointments.map(t => <Button
                                key={t.startAt}
                                w={"60px"}
                                onClick={() => {
                                    setValue(nameof<AppointmentDto>("employeeId"), i.id)
                                    setValue(nameof<AppointmentDto>("scheduleId"), t.scheduleId)
                                    setValue(nameof<AppointmentDto>("startAt"), t.startAt)
                                    setValue(nameof<AppointmentDto>("endAt"), t.endAt)

                                    goToPhone()
                                }}
                            >
                                {
                                    t.startAt
                                }
                            </Button>)
                        }
                        <Button
                            // leftIcon={<AiOutlineSchedule size={20} />}
                            // ml={2}
                            onClick={() => {
                                setValue(nameof<AppointmentDto>("employeeId"), i.id)
                                goToNext()
                            }}
                        >
                            Другое
                        </Button>
                    </Flex>

                </Box>)
            }
        </Box>
    );
}
