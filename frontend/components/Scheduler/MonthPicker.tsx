"use client"

import { Box, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import { IoIosArrowForward } from "react-icons/io"

const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]

type MonthPickerProps = {
    month: number
    year: number
    decreaseMonth: () => void
    increaseMonth: () => void
    print?: boolean
}

export const MonthPicker = ({month, year, decreaseMonth, increaseMonth, print}: MonthPickerProps) => {
    return <Flex gap={2} alignItems={"center"} cursor="pointer" justifyContent={"space-between"} px={4} mb={4} mr={!print ? "auto" : undefined}>
        {
            !print && <Box transform={"rotate(180deg)"}>
                <IoIosArrowForward onClick={decreaseMonth}/>
            </Box>
        }
        <Text fontSize={print ? 32 : undefined} w={"100%"} textAlign={"center"}>
            {
                `${months[month - 1]}, ${year}`
            }
        </Text>
        {
            !print && <Box cursor="pointer">
                <IoIosArrowForward onClick={increaseMonth}/>
            </Box>
        }
    </Flex>
}