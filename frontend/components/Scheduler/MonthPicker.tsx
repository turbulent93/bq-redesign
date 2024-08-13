"use client"

import { Box, Flex } from "@chakra-ui/react"
import { useState } from "react"
import { IoIosArrowForward } from "react-icons/io"

const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]

type MonthPickerProps = {
    month: number
    year: number
    decreaseMonth: () => void
    increaseMonth: () => void
}

export const MonthPicker = ({month, year, decreaseMonth, increaseMonth}: MonthPickerProps) => {
    return <Flex gap={2} alignItems={"center"} cursor="pointer" justifyContent={"space-between"} px={4} mb={4} mr="auto">
        <Box transform={"rotate(180deg)"}>
            <IoIosArrowForward onClick={decreaseMonth}/>
        </Box>
        {
            `${months[month - 1]}, ${year}`
        }
        <Box cursor="pointer">
            <IoIosArrowForward onClick={increaseMonth}/>
        </Box>
    </Flex>
}