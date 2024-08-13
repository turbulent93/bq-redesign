'use client'

import { Flex } from "@chakra-ui/react"
import { MonthPicker } from "./MonthPicker"
import { DatePicker } from "./DatePicker"
import { useState } from "react"

export type SchedulerValue = {
    date: string
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
}

export const Scheduler = ({isMonthPickerVisible = true, ...props}: SchedulerProps) => {
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [year, setYear] = useState(new Date().getFullYear())

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
        {
            isMonthPickerVisible && <MonthPicker
                month={month}
                year={year}
                decreaseMonth={decreaseMonth}
                increaseMonth={increaseMonth}
            />
        }
        <DatePicker
            month={month}
            year={year}
            decreaseMonth={decreaseMonth}
            increaseMonth={increaseMonth}
            {...props}
        />
    </Flex>
}