'use client'

import { Box, Button, Flex } from "@chakra-ui/react"
import { MonthPicker } from "./MonthPicker"
import { DatePicker } from "./DatePicker"
import { useEffect, useState } from "react"
import { BsArrowDown } from "react-icons/bs"
import { IoIosArrowDown } from "react-icons/io"

export type SchedulerValue = {
    date?: string
    scheduleId?: number
}

export type SchedulerProps = {
    value?: SchedulerValue
    onChange: (value: SchedulerValue) => void
    isDatePick?: boolean
    isMonthPickerVisible?: boolean
    contentType?: "COUNT" | "SLOTS" | "WORK_TIME"
    selectedSchedules?: number[]
    duration?: number
    selectFirst?: boolean
    userId?: number
    allowedWeekDays?: string
    print?: boolean
    collapsed?: boolean
    startAt?: string
    endAt?: string
}

export const Scheduler = ({isMonthPickerVisible = true, ...props}: SchedulerProps) => {
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [year, setYear] = useState(new Date().getFullYear())
    const [isCollapsed, setIsCollapsed] = useState(props.collapsed)

    const decreaseMonth = () => {
        if(month == 1) {
            setYear(year - 1)
            setMonth(12)
        } else {
            setMonth(month - 1)
        }
    }

    const increaseMonth = () => {
        if(month == 12) {
            setYear(year + 1)
            setMonth(1)
        } else {
            setMonth(month + 1)
        }
    }

    return <Flex
        alignItems={"center"}
        flexDir={"column"}
        w="100%"
        userSelect={"none"}
        mt={4}
    >
        <Flex justifyContent={"space-between"} w="100%">
            {
                isMonthPickerVisible && <MonthPicker
                    month={month}
                    year={year}
                    decreaseMonth={decreaseMonth}
                    increaseMonth={increaseMonth}
                    print={props.print}
                />
            }
            {
                !props.print && <Button size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
                    <Box transform={!isCollapsed ? "rotate(180deg)" : undefined}>
                        <IoIosArrowDown />
                    </Box>
                </Button>
            }
        </Flex>
        <DatePicker
            month={month}
            year={year}
            decreaseMonth={decreaseMonth}
            increaseMonth={increaseMonth}
            {...props}
            collapsed={isCollapsed}
        />
    </Flex>
}