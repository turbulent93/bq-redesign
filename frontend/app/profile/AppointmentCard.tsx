import { AppointmentDto, ScheduleDto, ServiceDto, UserDto } from "@/services/client";
import { promosClient, schedulesClient, servicesClient } from "@/services/services";
import { DATE_FORMAT, weekDays } from "@/utils/constants";
import { Box, Flex, Text } from "@chakra-ui/react";
import moment, { weekdays } from "moment";
import { useMemo } from "react";
import { useQuery } from "react-query";


type AppointmentCardProps = {
    id?: number | undefined;
    employeeId?: number;
    scheduleId?: number;
    serviceId?: number;
    startAt?: string;
    endAt?: string;
    phone?: string;
    paidWithBonuses?: number | undefined;
    promoId?: number | undefined;
    inviterId?: number | undefined;
    employee?: UserDto | undefined;
    schedule?: ScheduleDto | undefined;
    service?: ServiceDto | undefined;
}

const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]

export const AppointmentCard = (props: AppointmentCardProps) => {
    const {data: schedule} = useQuery(
        ["view schedule", props.scheduleId],
        () => schedulesClient.view(props.scheduleId!), {
            enabled: !!props.scheduleId && !props.schedule
        }
    )

    const {data: service} = useQuery(
        ["view service", props.serviceId],
        () => servicesClient.view(props.serviceId!), {
            enabled: !!props.serviceId && !props.service
        }
    )

    const {data: promo} = useQuery(
        ["view promo", props.promoId],
        () => promosClient.view(props.promoId!), {
            enabled: !!props.promoId
        }
    )

    const date = useMemo(() => schedule || props.schedule
        ? moment(schedule
            ? schedule?.date
            : props.schedule?.date, DATE_FORMAT) 
        : moment(),
    [schedule])

    const s = useMemo(() => props.service ? props.service : service, [props.service, service])

    return <Box
        borderRadius={"md"}
        p={3}
        bgColor={"gray.100"}
        position={"relative"}
        mb={3}
    >
        {
            props.service?.bonusCount! > 0 && props.paidWithBonuses == 0 && <Box
                fontSize={12}
                position={"absolute"}
                top={-1}
                right={-1}
                bgColor={"gray.700"}
                color={"white"}
                px={2}
                py={1}
                borderRadius={"md"}
                shadow={"lg"}
            >
                +{props.service?.bonusCount} бонусов
            </Box>
        }
        <Flex
            alignItems={"center"}
        >
            <Box
                bgColor={"gray.700"}
                borderRadius={"md"}
                p={2}
                color={"white"}
                mr={6}
                shadow={"lg"}
                w={"100px"}
            >
                <Text
                    fontSize={20}
                    textAlign={"center"}
                    textTransform={"uppercase"}
                >
                    {
                        weekDays[date.weekday() - 1]
                    }
                </Text>
                <Text
                    textAlign={"center"}
                    whiteSpace={"nowrap"}
                >
                    {
                        date.date()
                        + " "
                        + months[date.month()]
                    },
                </Text>
                <Text
                    textAlign={"center"}
                >
                    {
                        date.year()
                    }
                </Text>
            </Box>
            <Box>
                <Text
                    fontWeight={"bold"}
                    fontSize={24}
                    mb={1}
                >
                    {
                        s?.name || "Услуга"
                    }
                </Text>
                <Text
                    // fontWeight={"bold"}
                    fontSize={12}
                    mb={1}
                >
                    {
                        `${props?.startAt || "10:00"} - ${props?.endAt || "10:30"}`
                    }
                </Text>
                <Text
                    color={"gray.700"}
                    fontSize={18}
                    mb={1}
                >
                    {
                        s && (promo || props.paidWithBonuses)
                            ? <Flex textTransform={"uppercase"}>
                                <Text mr={1} textDecor={"line-through"}>
                                    {
                                        s?.price
                                    }р
                                </Text>
                                {
                                    promo
                                        ? promo.promoServices.find(i => i.serviceId == s?.id)?.discount
                                        : s?.price - (props.paidWithBonuses || 0)
                                }р
                            </Flex>
                            : `${s?.price || 500}Р`
                    }
                </Text>
            </Box>
        </Flex>
    </Box>
}