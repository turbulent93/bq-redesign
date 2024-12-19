import { AppointmentDto } from "@/services/client"
import { promosClient } from "@/services/services"
import { PROMO_LIMIT_WEEKDAYS, PROMO_LIMIT_WEEKEND, weekDays } from "@/utils/constants"
import { nameof } from "@/utils/nameof"
import { Box, Flex, Switch, Text } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { useQuery } from "react-query"

type UsePromoProps = {
    usePromo: boolean
    setUsePromo: (v: boolean) => void
    promoId?: number
}

export const UsePromo = ({usePromo, setUsePromo, promoId}: UsePromoProps) => {
    const {setValue} = useFormContext()

    const {data} = useQuery(
        ["view promo", promoId],
        () => promosClient.view(Number(promoId)), {
            enabled: !!promoId
        }
    )

    return !!promoId && <Box>
        <Flex mb={1} alignItems={"center"} justifyContent={"center"}>
            <Text mr={4} fontSize={18}>
                Использовать акцию
            </Text>
            <Switch
                isChecked={usePromo}
                onChange={(e) => {
                    setUsePromo(e.target.checked)
                    if(e.target.checked) {
                        setValue(nameof<AppointmentDto>("promoId"), promoId)
                    } else {
                        setValue(nameof<AppointmentDto>("promoId"), undefined)
                    }
                }}
                variant={"gray"}
            />
        </Flex>
        <Flex mb={4} textAlign={"center"} color={"gray.500"} flexWrap={"wrap"} justifyContent={"center"}>
            {
                (data?.allowedWeekDays || data?.startAt || data?.endAt) && <>
                    (Применяется только в {
                        data.allowedWeekDays == PROMO_LIMIT_WEEKDAYS || data.allowedWeekDays == PROMO_LIMIT_WEEKEND
                            ? <Text fontWeight={"bold"}>{data.allowedWeekDays}</Text>
                            : data
                                .allowedWeekDays
                                ?.split("")
                                .sort()
                                .map((i: string, index) => <Flex ml={1} key={index}>
                                    <Text
                                        textTransform={"uppercase"}
                                        fontWeight={"bold"}
                                        // fontSize={16}
                                    >
                                        {weekDays[Number(i) - 1]}
                                    </Text>
                                    {
                                        data?.allowedWeekDays?.length == index + 2
                                            ? <Text ml={1}>и</Text>
                                            : data?.allowedWeekDays?.length! > index + 2
                                            ? ","
                                            : undefined
                                    }
                                </Flex>)
                    }
                    {
                        data.startAt && <Flex ml={1}>
                            с
                            <Text
                                textTransform={"uppercase"}
                                fontWeight={"bold"}
                                // fontSize={16}
                                ml={1}
                            >
                                {data.startAt}
                            </Text>
                        </Flex>
                    }
                    {
                        data.endAt && <Flex ml={1}>
                            до
                            <Text
                                textTransform={"uppercase"}
                                fontWeight={"bold"}
                                // fontSize={16}
                                ml={1}
                            >
                                {data.endAt}
                            </Text>
                        </Flex>
                    })
                </>
            }
        </Flex>
    </Box>
}