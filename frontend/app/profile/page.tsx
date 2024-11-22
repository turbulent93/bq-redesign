"use client"

import { Box, Button, Container, Flex, Link, Text, useDisclosure } from "@chakra-ui/react";
import { AppointmentCard } from "./AppointmentCard";
import { PunchMapCard } from "@/components/cards/PunchMapCard";
import { useQuery } from "react-query";
import { usersClient } from "@/services/services";
import moment from "moment";
import { BsArrowLeft } from "react-icons/bs";
import { TbArrowBarToLeft } from "react-icons/tb";
import { Content } from "../Content";
import { useAuth } from "@/utils/useAuth";
import { useEffect, useMemo } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { DATE_FORMAT, TIME_FORMAT } from "@/utils/constants";

export default function Page() {
    const {user: data} = useAuth()
    
    const upcomingAppointments = useMemo(() => data
        ?.appointments
        ?.filter(i => moment().isSameOrBefore(moment(i.schedule?.date, DATE_FORMAT))), [data])
        ?.sort((a, b) => {
            const aDate = moment(`${a.schedule?.date} ${a.startAt}`, `${DATE_FORMAT} ${TIME_FORMAT}`)
            const bDate = moment(`${b.schedule?.date} ${b.startAt}`, `${DATE_FORMAT} ${TIME_FORMAT}`)

            return aDate.isAfter(bDate) ? -1 : aDate.isSame(bDate) ? 0 : 1
        })
    
    const pastAppointments = useMemo(() => data
        ?.appointments
        ?.filter(i => moment().isSameOrAfter(moment(i.schedule?.date, DATE_FORMAT))), [data])
        ?.sort((a, b) => {
            const aDate = moment(`${a.schedule?.date} ${a.startAt}`, `${DATE_FORMAT} ${TIME_FORMAT}`)
            const bDate = moment(`${b.schedule?.date} ${b.startAt}`, `${DATE_FORMAT} ${TIME_FORMAT}`)

            return aDate.isAfter(bDate) ? -1 : aDate.isSame(bDate) ? 0 : 1
        })

    return <Content type={"register"}>
        <ProfileHeader />
        <Container>
            {
                data?.punchMapId && <PunchMapCard
                    {
                        ...data?.punchMap!
                    }
                    items={data?.punchMap?.punchMapPromos}
                    showProgress
                />
            }
            {
                upcomingAppointments && upcomingAppointments.length > 0 && <Text
                    fontSize={22}
                    fontWeight={"bold"}
                    my={4}
                >
                    Предстоящие записи
                </Text>
            }
            {
                upcomingAppointments
                    ?.map(i => <AppointmentCard key={i.id} {...i}/>)
            }
            {
                pastAppointments && pastAppointments.length > 0 && <Text
                    fontSize={22}
                    fontWeight={"bold"}
                    my={4}
                >
                    Прошедшие записи
                </Text>
            }
            {
                
                pastAppointments
                    ?.map(i => <AppointmentCard key={i.id} {...i}/>)            
            }
            {
                upcomingAppointments && upcomingAppointments.length == 0
                && pastAppointments && pastAppointments.length == 0
                && <Box textAlign={"center"}>
                    <Text fontSize={24} mb={2}>
                        Записи не найдены
                    </Text>
                    <Button>
                        <Link href={"/appointment"}>
                            Записаться
                        </Link>
                    </Button>
                </Box>
            }
        </Container>
    </Content>
}