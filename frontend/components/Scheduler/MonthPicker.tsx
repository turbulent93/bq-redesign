"use client"

import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]

type MonthPickerProps = {
    month: number
    year: number
    decreaseMonth: () => void
    increaseMonth: () => void
    print?: boolean
}

export const MonthPicker = ({month, year, decreaseMonth, increaseMonth, print}: MonthPickerProps) => {
    return <Flex
        gap={2}
        alignItems={"center"}
        cursor="pointer"
        justifyContent={"space-between"}
        w={print ? "100%" : undefined}
        mb={4}
        mr={!print ? "auto" : undefined}
    >
        {
            !print && <Button size="sm" onClick={decreaseMonth}>
                <Box>
                    <IoIosArrowBack/>

                </Box>
            </Button>
        }
        <Text fontSize={print ? 32 : 18} w={"100%"} textAlign={"center"}>
            {
                `${months[month - 1]}, ${year}`
            }
        </Text>
        {
            !print && <Button size="sm" onClick={increaseMonth}>
                <Box>
                    <IoIosArrowForward />
                </Box>
            </Button>
        }
    </Flex>
}