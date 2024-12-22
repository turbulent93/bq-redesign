"use client"

import { ScheduleDayDto, ScheduleTimeDto } from "@/services/client"
import { schedulesClient } from "@/services/services"
import { Box, Flex, Grid, GridItem, Modal, ModalCloseButton, ModalContent, ModalOverlay, scroll, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import moment, { isMoment, weekdays } from "moment"
import { useEffect, useMemo, useRef, useState } from "react"
import { SchedulerProps } from "./Scheduler"
import { useAuth } from "@/utils/useAuth"
import { useSchedulesQuery } from "./useSchedulesQuery"
import { DATE_FORMAT, PROMO_LIMIT_WEEKDAYS, PROMO_LIMIT_WEEKEND, weekDays } from "@/utils/constants"

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
    i: ScheduleDayDto,
    selectedScheduleId?: number,
    print?: boolean
) => {
    if(isToday(year, month, i.day) && !print)
        return "blue.100"

    if(i.scheduleId) {
        if(i.scheduleId == selectedScheduleId) {
            return "gray.100"
        } else {
            return "gray.700"
        }
    }
    if(i.isCurrentMonth) {
        return "gray.400"
    }
    return "gray.200"
}

const checkAwType = (aw?: string, index?: number) => {
    if(aw == PROMO_LIMIT_WEEKDAYS) {
        return index! >= 1 && index! <= 5
    }

    if(aw == PROMO_LIMIT_WEEKEND) {
        return index == 5 || index == 6
    }
}

// const isAllowedWeekday = (aw?: string, index?: number) => checkAwType(aw, index) || !aw || aw?.includes(String((index! % 7) + 1))

const isAllowedWeekday = (aw?: string, index?: number) => !aw || (checkAwType(aw, index) || (aw?.includes(String((index! % 7) + 1))))

const getBgColor = (
    scheduleId?: number,
    selectedScheduleId?: number,
    selectedSchedules?: number[],
    allowedWeekDays?: string,
    index?: number
) => {
    // if(!!selectedScheduleId) {
    //     console.log(selectedScheduleId)
    // }
    if(!!scheduleId && scheduleId == selectedScheduleId) {
        return "gray.700"
    }
    if(allowedWeekDays && allowedWeekDays?.includes(String((index! % 7) + 1))) {
        return "gray.300"
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
    selectFirst,
    allowedWeekDays,
    print,
    collapsed,
    startAt,
    endAt
}: DatePickerProps) => {
    const queryClient = useQueryClient()
    
    const {user} = useAuth()

    const toast = useToast()

    // const [selectedDate, setSelectedDate] = useState<number | undefined>()

    const {data, isLoading} = useSchedulesQuery({
        month,
        year,
        employeeId: userId,
        duration,
        contentType,
        startAt,
        endAt,
        select: collapsed ? (data) => data.filter(i => i.isCurrentMonth) : undefined 
    })

    // const {data: nearest} = useQuery(
    //     ["get nearest schedule", userId],
    //     () => schedulesClient.nearest({employeeId: userId!}), {
    //         enabled: !!userId && contentType == "SLOTS"
    //     }
    // )

    const {mutate: createMutate} = useMutation((day: number) => schedulesClient.create({
        date: moment(new Date(year, month - 1, day)).format(DATE_FORMAT),
        employeeId: userId!,
        startAt: user?.startWorkTime || "10:00",
        endAt: user?.endWorkTime || "18:00"
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries(["get schedules"])
        }
    })

    // const {isOpen, onOpen, onClose} = useDisclosure()

    const onChangeHandler = (day: number, scheduleId?: number) => {
        onChange({date: moment({year, month: month - 1, day}).format(DATE_FORMAT), scheduleId})
    }
    
    const handler = (item: ScheduleDayDto, index: number) => {
        if(!item.isCurrentMonth || !isAllowedWeekday(allowedWeekDays, collapsed ? (index + fdwd) % 7 : index % 7)) return

        if(isDatePick) {
            onChangeHandler(item.day, item.scheduleId)
            return
        }

        if(!item.scheduleId) {
            createMutate(item.day)
            // if(isTodayOrAfter(year, month, item.day)) {
            //     createMutate(item.day)
            // } else {
            //     toast({
            //         title: "Нельзя создать день для записи раньше чем сегодня",
            //         isClosable: true,
            //         status: "error",
            //         position: "top"
            //     })
            // }
        } else {
            onChangeHandler(item.day, item.scheduleId)
        }
    }

    

    const fdwd = useMemo(() => {
        const weekday = moment().set({year, month: month - 1, date: 1}).weekday()

        return (weekday == 0 ? 7 : weekday) - 1
    }, [month, year])

    const scrollToRef = useRef<HTMLDivElement>(null)

    const nearest = useMemo(() => data?.find(i => i.isCurrentMonth
        && i.scheduleId
        && (!allowedWeekDays
            || allowedWeekDays.includes(String(moment({year, month: month - 1, date: i.day}).weekday())))),
    [data, allowedWeekDays])

    const str = useMemo(() => value?.date
        ? moment(value.date, DATE_FORMAT).date()
        : contentType == "SLOTS" && nearest
            ? nearest.day
            : moment().month() == month - 1 && moment().year() == year
                ? moment().date()
                : 1,
    [month, year, nearest, value?.date])

    // const isNearest = (day: number) => {
    //     if(!nearest) return
        
    //     const n = moment(nearest.date, DATE_FORMAT)

    //     return n.month() == month - 1
    //         && n.year() == year
    //         && n.date() == day
    // }

    // const isScrollRef = (day: number, index: number, si?: number) => {
    //     console.log(day, !!scrollToRef.current)
    //     if(!!scrollToRef.current) return false
        
    //     if(contentType != "SLOTS") return isToday(year, month, day)

    //     if(allowedWeekDays && isAllowedWeekday(allowedWeekDays, collapsed ? (index + fdwd) % 7 : index % 7) && !!si) {
    //         console.log(day, !!scrollToRef.current)
    //         return true
    //     }

    //     return false
    // }

    useEffect(() => {
        if(!collapsed) return

        // console.log(scrollToRef.current)

        const timeout = setTimeout(() => scrollToRef.current?.scrollIntoView({
            block: "nearest",
            behavior: "smooth",
            inline: "center"
        }), 1000)

        return () => clearTimeout(timeout)
    }, [str, collapsed, data])

    const isSelected = (si?: number) => !!si && si == value?.scheduleId 

    if(isLoading)
        return  <Flex w="100%" justifyContent={"center"} alignItems="center" my={4}>
            <Spinner />
        </Flex>

    return <>
        <Grid
            templateColumns={!collapsed ? "repeat(7, 1fr)" : `repeat(${data?.length}, 60px)`}
            templateRows={!collapsed ? "repeat(7, 1fr)" : "repeat(1, 1fr)"}
            w="100%"
            columnGap={1}
            rowGap={!collapsed ? 1 : undefined}
            overflowX={collapsed ? "scroll" : undefined}
        >
            {
                !collapsed && weekDays.map((i, index) => <GridItem
                    key={i}
                    textTransform={"uppercase"}
                    color={"gray.500"}
                    textAlign={"center"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    fontSize={print ? 24 : 18}
                >
                    <Flex
                        borderRadius={"md"}
                        bgColor={allowedWeekDays && isAllowedWeekday(allowedWeekDays, index) ? "gray.100" : undefined}
                        alignItems={"center"}
                        justifyContent={collapsed ? "start" : "center"}
                        w={!collapsed ? "40px" : "60px"}
                        h={!collapsed ? "40px" : "100%"}
                    >
                        {
                            i
                        }
                    </Flex>
                </GridItem>)
            }
            {
                data?.map((i, index) => <GridItem
                    key={index}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"start"}
                    flexDir={"column"}
                >
                    <Flex
                        ref={
                            str == i.day ? scrollToRef : undefined
                        }
                        flexDir={"column"}
                        alignItems={"center"}
                        justifyContent={collapsed ? "start" : "center"}
                        w={!collapsed ? "40px" : "60px"}
                        h={!collapsed ? "40px" : "100%"}
                        bgColor={
                            !!i.scheduleId && i.scheduleId == value?.scheduleId 
                                ? "gray.700" 
                                : allowedWeekDays && isAllowedWeekday(allowedWeekDays, collapsed ? (index + fdwd) % 7 : index % 7) && !!i.scheduleId
                                    ? "gray.200"
                                    : isToday(year, month, i.day)
                                        ? "gray.100"
                                        : undefined
                        }
                        // bgGradient={isSelected(i.day) ? 'linear(to-br, gray.700, red.500)' : undefined}
    
                        borderTopRadius={"md"}
                        borderBottomRadius={!collapsed ? "md" : undefined}
                        color={isSelected(i.scheduleId) ? "white" : "gray.700"}
                        onClick={() => handler(i, index)}
                        opacity={
                            !i.isCurrentMonth
                                ? "0.3"
                                : !i.scheduleId || !isAllowedWeekday(allowedWeekDays, collapsed ? (index + fdwd) % 7 : index % 7) 
                                    ? "0.6"
                                    : undefined
                        }
                        // border={isToday(year, month, i.day) ? "1px" : undefined}
                        py={collapsed ? 1 : undefined}
                    >
                        <Text
                            fontSize={print ? 24 : collapsed ? 20 : 18}
                            fontWeight={"bold"}
                        >
                            {i.day}
                            {
                                // i.isNearest ? "n" : "d"
                            }
                        </Text>
                        {
                            collapsed && <Text>
                                {weekDays[(index + fdwd) % 7]}
                            </Text>
                        }
                        {
                            collapsed && <Text
                                // h={"20px"}
                                color={
                                    isSelected(i.scheduleId)
                                        ? "white"
                                        : collapsed && isAllowedWeekday(allowedWeekDays, collapsed ? (index + fdwd) % 7 : index % 7)
                                            ? "gray.700"
                                            : "red.300"
                                }
                                fontSize={print ? 20 : 10}
                                fontWeight="bold"
                                whiteSpace={"nowrap"}
                            >
                                {
                                    // i.scheduleId && "3 места"
                                }
                                {
                                    i.scheduleId && selectedSchedules
                                        ? selectedSchedules.includes(i.scheduleId) && i.content
                                        : i.content
                                }
                                {/* 3 slots */}
                            </Text>
                        }
                    </Flex>
                    {
                        !collapsed && <Text
                            // h={"20px"}
                            color={!isAllowedWeekday(allowedWeekDays, collapsed ? (index + fdwd) % 7 : index % 7)
                                ? "red.100"
                                : "red.300"}
                            fontSize={print ? 20 : 10}
                            fontWeight="bold"
                            whiteSpace={"nowrap"}
                        >
                            {
                                // i.scheduleId && "3 места"
                            }
                            {
                                i.scheduleId && selectedSchedules
                                    ? selectedSchedules.includes(i.scheduleId) && i.content
                                    : i.content
                            }
                            {/* 3 slots */}
                        </Text>
                    }
                </GridItem>)
            }
        </Grid>
    </>
}