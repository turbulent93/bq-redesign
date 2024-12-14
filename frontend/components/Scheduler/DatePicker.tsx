"use client"

import { ScheduleDayDto, ScheduleTimeDto } from "@/services/client"
import { schedulesClient } from "@/services/services"
import { Box, Flex, Grid, GridItem, Modal, ModalCloseButton, ModalContent, ModalOverlay, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import moment, { isMoment } from "moment"
import { useState } from "react"
import { SchedulerProps } from "./Scheduler"
import { useAuth } from "@/utils/useAuth"
import { useSchedulesQuery } from "./useSchedulesQuery"
import { DATE_FORMAT } from "@/utils/constants"

const weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]

type DatePickerProps = {
    month: number
    year: number
    decreaseMonth: () => void
    increaseMonth: () => void
} & SchedulerProps

const isToday = (year: number, month: number, day: number) => {
    const curDate = new Date()

    return year == curDate.getFullYear() && month == curDate.getMonth() + 1 && day == curDate.getDate()
}

const isTodayOrAfter = (year: number, month: number, day: number) => {
    const curDate = new Date()

    return year == curDate.getFullYear() && month == curDate.getMonth() + 1 && day >= curDate.getDate()
}

const getTextColor = (
    year: number,
    month: number,
    day: number,
    scheduleId?: number,
    selectedScheduleId?: number
) => {
    if(isToday(year, month, day))
        return "blue.100"

    if(scheduleId) {
        if(scheduleId == selectedScheduleId) {
            return "gray.100"
        } else {
            return "gray.600"
        }
    } else {
        return "gray.400"
    }
}

const getBgColor = (
    scheduleId?: number,
    selectedScheduleId?: number,
    selectedSchedules?: number[]
) => {
    if(!!scheduleId && scheduleId == selectedScheduleId) {
        return "gray.500"
    }
    if(!!scheduleId && selectedSchedules?.includes(scheduleId)) {
        return "red.100"
    }
}

export const DatePicker = ({
    month,
    year,
    value,
    onChange,
    duration,
    isDatePick,
    contentType = "SLOTS",
    selectedSchedules,
    userId,
    selectFirst
}: DatePickerProps) => {
    const queryClient = useQueryClient()
    
    const {user} = useAuth()

    const toast = useToast()

    // const [selectedDate, setSelectedDate] = useState<number | undefined>()

    const {data, isLoading} = useSchedulesQuery({month, year, employeeId: userId, duration, contentType})

    const {mutate: createMutate} = useMutation((day: number) => schedulesClient.create({
        date: moment(new Date(year, month - 1, day)).format(DATE_FORMAT),
        employeeId: userId!,
        startAt: "10:00",
        endAt: "18:00"
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries(["get schedules"])
        }
    })

    // const {isOpen, onOpen, onClose} = useDisclosure()

    const onChangeHandler = (day: number, scheduleId?: number) => {
        onChange({date: moment({year, month: month - 1, day}).format(DATE_FORMAT), scheduleId})
    }

    const handler = (item: ScheduleDayDto) => {
        if(!item.isCurrentMonth) return

        if(isDatePick) {
            onChangeHandler(item.day, item.scheduleId)
            return
        }

        if(!item.scheduleId) {
            if(isTodayOrAfter(year, month, item.day)) {
                createMutate(item.day)
            } else {
                toast({
                    title: "Нельзя создать день для записи раньше чем сегодня",
                    isClosable: true,
                    status: "error"
                })
            }
        } else {
            onChangeHandler(item.day, item.scheduleId)
        }
    }

    if(isLoading)
        return  <Flex w="100%" justifyContent={"center"} alignItems="center" my={4}>
            <Spinner />
        </Flex>

    // if(isAppointment && data && !data.find(i => i.isCurrentMonth && i.content)) {
    //     return <Flex
    //         w="100%"
    //         justifyContent={"center"}
    //         alignItems="center"
    //         cursor={"pointer"}
    //         gap={2}
    //         textColor={"gray.600"}
    //     >
    //         Нет доступного времени в этом месяце
    //     </Flex>
    // }

    return <>
        <Grid
            templateColumns={"repeat(7, 1fr)"}
            templateRows={"repeat(7, 1fr)"}
            w="100%"
            gap={2}
        >
            {
                weekDays.map(i => <GridItem
                    w="100%"
                    p={2}
                    textAlign={"center"}
                    textTransform={"uppercase"}
                    fontWeight={"bold"}
                    fontSize={12}
                    textColor={"gray.500"}
                    key={i}
                >{i}</GridItem>)
            }
            {
                data?.map((i, index) => <GridItem key={index} w="100%">
                    <Flex
                        w="100%"
                        h="60px"
                        py={1}
                        flexDir={"column"}
                        alignItems={"center"}
                        opacity={!i.isCurrentMonth ? "0.5" : undefined}
                    >
                        <Flex
                            textColor={getTextColor(year, month, i.day, i.scheduleId, value?.scheduleId)}
                            bgColor={getBgColor(i.scheduleId, value?.scheduleId, selectedSchedules)}
                            _hover={{
                                bgColor: contentType == "COUNT" ? "red.200" : "gray.500",
                                color: "gray.100"
                            }}
                            fontWeight={isToday(year, month, i.day) ? "bold" : undefined}
                            fontSize={isToday(year, month, i.day) ? 14 : 12}
                            textAlign={"center"}
                            cursor={"pointer"}
                            onClick={() => handler(i)}
                            borderRadius={"100%"}
                            h="36px"
                            w="36px"
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            {i.day}
                        </Flex>
                        {
                            i.scheduleId && <Text color="red.300" fontSize={10} fontWeight="bold" whiteSpace={"nowrap"}>
                                {
                                    selectedSchedules
                                        ? selectedSchedules.includes(i.scheduleId) && i.content
                                        : i.content
                                }
                            </Text>
                        }
                    </Flex>
                    
                </GridItem>)
            }
        </Grid>
    </>
}