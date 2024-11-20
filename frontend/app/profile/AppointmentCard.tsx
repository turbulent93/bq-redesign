import { AppointmentDto } from "@/services/client";
import { Box, Flex, Text } from "@chakra-ui/react";
import moment from "moment";


type AppointmentCardProps = {} & AppointmentDto

const weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]

const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]

export const AppointmentCard = (props: AppointmentCardProps) => {
    return <Box
        borderRadius={"md"}
        p={3}
        bgColor={"gray.100"}
        position={"relative"}
        mb={3}
    >
        {
            props.service?.bonusCount! > 0 && <Box
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
                        weekDays[moment(props.schedule?.date, "DD.MM.YYYY HH:mm:ss").day() - 1]
                    }
                </Text>
                <Text
                    textAlign={"center"}
                >
                    {
                        moment(props.schedule?.date, "DD.MM.YYYY HH:mm:ss").date()
                        + " "
                        + months[moment(props.schedule?.date, "DD.MM.YYYY HH:mm:ss").month()]
                    },
                </Text>
                <Text
                    textAlign={"center"}
                >
                    {
                        moment(props.schedule?.date, "DD.MM.YYYY HH:mm:ss").year()
                    }
                </Text>
            </Box>
            <Box>
                <Text
                    fontSize={24}
                    mb={1}
                >
                    {
                        props.service?.name
                    }
                </Text>
                <Text
                    fontWeight={"bold"}
                    fontSize={12}
                    mb={1}
                >
                    {
                        `${props.startAt} - ${props.endAt}`
                    }
                </Text>
                <Text
                    color={"gray.700"}
                    fontSize={16}
                    mb={1}
                >
                    {props.service?.price}р
                </Text>
            </Box>
        </Flex>
    </Box>
}