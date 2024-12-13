import { UserDto } from "@/services/client"
import { DATE_FORMAT, TIME_FORMAT } from "@/utils/constants"
import { Box, Button, Link, Text } from "@chakra-ui/react"
import moment from "moment"
import { useMemo } from "react"
import { AppointmentCard } from "./AppointmentCard"

export const ClientAppointments = ({data, withClient}: {data?: UserDto, withClient?: boolean}) => {
    const upcomingAppointments = useMemo(() => data
        ?.clientAppointments
        ?.filter(i => moment().isSameOrBefore(moment(i.schedule?.date, DATE_FORMAT))), [data])
        ?.sort((a, b) => {
            const aDate = moment(`${a.schedule?.date} ${a.startAt}`, `${DATE_FORMAT} ${TIME_FORMAT}`)
            const bDate = moment(`${b.schedule?.date} ${b.startAt}`, `${DATE_FORMAT} ${TIME_FORMAT}`)

            return aDate.isAfter(bDate) ? -1 : aDate.isSame(bDate) ? 0 : 1
        })
    
    const pastAppointments = useMemo(() => data
        ?.clientAppointments
        ?.filter(i => moment().isSameOrAfter(moment(i.schedule?.date, DATE_FORMAT))), [data])
        ?.sort((a, b) => {
            const aDate = moment(`${a.schedule?.date} ${a.startAt}`, `${DATE_FORMAT} ${TIME_FORMAT}`)
            const bDate = moment(`${b.schedule?.date} ${b.startAt}`, `${DATE_FORMAT} ${TIME_FORMAT}`)

            return aDate.isAfter(bDate) ? -1 : aDate.isSame(bDate) ? 0 : 1
        })

    return <>
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
                    <Link href={withClient ? `/dashboard/appointments/add?phone=${data?.login}` : "/appointment"}>
                        {withClient ? "Добавить запись" : "Записаться"}
                    </Link>
                </Button>
            </Box>
        }
    </>
}