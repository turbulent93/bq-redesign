import { PromoDto } from "@/services/client"
import { PROMO_LIMIT_WEEKDAYS, PROMO_LIMITS, weekDays } from "@/utils/constants"
import { nameof } from "@/utils/nameof"
import { Box, Button, Flex } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"


export const PromoLimits = () => {
    const {watch, setValue} = useFormContext()

    const limits = watch(nameof<PromoDto>("allowedWeekDays")) || ""

    const handler = (v: string) => {
        setValue(nameof<PromoDto>("allowedWeekDays"), v == "" ? undefined : v)
    }

    return <Box mb={3}>
        <Flex gap={3} mb={3}>
            {
                weekDays.map((i, index) => <Flex
                    key={index}
                    bgColor={limits.includes(index + 1) ? "gray.700" : "gray.100"}
                    borderRadius={"md"}
                    py={2}
                    color={limits.includes(index + 1) ? "white" : "gray.700"}
                    onClick={() => handler(limits.includes(index + 1) ? limits.replace(index + 1, "") : limits + (index + 1))}
                    fontWeight={"bold"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    w="100%"
                >
                    {
                        i
                    }
                </Flex>)
            }
        </Flex>
        <Flex gap={3}>
            {
                PROMO_LIMITS.map(i => <Flex
                    key={i}
                    bgColor={limits == i ? "gray.700" : "gray.100"}
                    borderRadius={"md"}
                    py={2}
                    color={limits == i ? "white" : "gray.700"}
                    onClick={() => handler(limits == i ? "" : i)}
                    fontWeight={"bold"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    w="100%"
                >
                    {
                        i
                    }
                </Flex>)
            }
        </Flex>
    </Box>
}