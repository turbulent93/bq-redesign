import { AppointmentDto } from "@/services/client"
import { appointmentsClient } from "@/services/services"
import { Box, Divider, Grid, GridItem, Text } from "@chakra-ui/react"
import moment from "moment"
import { useQuery } from "react-query"

type AppointmentsActivityProps = {
    data?: AppointmentDto[]
}

const DEFAULT_START_HOUR = "8:00"
const DEFAULT_END_HOUR ="22:00"

const getTimeItems = (startAt: string, endAt: string) => {
    const items = []
    const startHour = moment(startAt, "HH:mm").hour()
    const endHour = moment(endAt, "HH:mm").hour()
    const cur = moment({hours: startHour, minutes: 0})

    for (let i = 0; i <= endHour - startHour; i++) {
        items.push(`${cur.hour()}:00`)
        cur.add(1, 'hours')
    }

    return items
}

const getColSpan = (startAt: string, endAt: string, isWrapped?: boolean) => {
    const end = moment(endAt, "HH:mm")

    if(isWrapped) {
        // console.log((end.hours() - 9 + index) + (end.minutes() > 0 ? 1 : 0))
        // return (end.hours() - 9 + index) + (end.minutes() > 0 ? 1 : 0)
        return end.hours() % 4 + (end.minutes() > 0 ? 1 : 0)
    }

    return (end.hours() - moment(startAt, "HH:mm").hours()) + (end.minutes() > 0 ? 1 : 0)
}

const getRow = (startAt: string) => {
    const hours = moment(startAt, "HH:mm").hours()

    if(hours < 12)
        return 2
    else if(hours < 16)
        return 4
    else if(hours < 20)
        return 6
    else
        return 8
}

const isWrapped = (startAt: string, endAt: string) => {
    const endTime = moment(endAt, "HH:mm")
    const startTime = moment(startAt, "HH:mm")

    return getColStart(startAt) == 4 && endTime.hours() > startTime.hours() && endTime.minutes() != 0
}

const getMl = (startAt: string, endAt: string) => {
    const colSpan = isWrapped(startAt, endAt) ? 1 : getColSpan(startAt, endAt)
    const startMinutes = moment(startAt, "HH:mm").minutes()

    // if(startAt == "11:10" || startAt == "14:10")
    //     console.log(startAt, `${startMinutes / (60 * colSpan) * 100}%`)

    // return "16%"
    return `${startMinutes / (60 * colSpan) * 100}%`
}

const getColStart = (startAt: string) => {
    const hour = moment(startAt, "HH:mm").hours()

    return hour % 4 + 1
}

const getMr = (startAt: string, endAt: string, isNext?: boolean) => {
    const endTime = moment(endAt, "HH:mm")

    if(isNext) {
        return `${(60 - endTime.minutes()) / 60 * 100}%`
    }
    
    if(isWrapped(startAt, endAt)) {
        return 0
    }

    const startTime = moment(startAt, "HH:mm")
    const colSpan = getColSpan(startAt, endAt)
    const endMinutes = endTime.hours() > startTime.hours() && endTime.minutes() == 0
        ? 60
        : endTime.minutes()

    if(startAt == "11:10")
        console.log(colSpan)
        // console.log("mr", `${(60 - endMinutes) / (60 * colSpan) * 100}%`)

    // return "33%"
    return `${(60 - endMinutes) / (60 * colSpan) * 100}%`
}

const colors = ["gray", "red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink"]

export const AppointmentsActivity = ({data}: AppointmentsActivityProps) => {
    const timeItems = getTimeItems(DEFAULT_START_HOUR, DEFAULT_END_HOUR)
    const COLS = 4

    return <Grid
        // mx={0}
        minW="800px"
        templateColumns={"repeat(4, 1fr)"}
        gridTemplateRows={"20px 80px 20px 80px 20px 80px 20px 80px"}
        w="100%"
        position={"relative"}
    >
        {
            timeItems.map((i, index) => <GridItem
                key={i}
                border={"gray.600"}
                gridRow={((index - index % 4) / 4) * 2 + 1}
            >
                <Box>
                    <Text fontSize={14} textColor={"gray.600"} ml={2}>{i}</Text>
                </Box>
            </GridItem>)
        }
        {
            data?.map((i, index) =>
                <GridItem 
                    bgColor={`${colors[index % colors.length]}.100`}
                    gridRow={getRow(i.startAt)}
                    colSpan={getColSpan(i.startAt, i.endAt)}
                    colStart={getColStart(i.startAt)}
                    borderLeftRadius={5}
                    borderRightRadius={isWrapped(i.startAt, i.endAt) ? 0 : 5}
                    my={3}
                    textColor={"gray.600"}
                    py={1}
                    px={2}
                    ml={getMl(i.startAt, i.endAt)}
                    mr={getMr(i.startAt, i.endAt)}
                    key={i.id}
                >
                    <Text
                        fontSize={16} 
                        whiteSpace={"nowrap"}
                        overflow={"hidden"}
                        textOverflow={"ellipsis"}
                    >
                        {i.service?.name}
                    </Text>
                    <Text
                        fontWeight={"bold"}
                        fontSize={12}
                        whiteSpace={"nowrap"}
                        overflow={"hidden"}
                        textOverflow={"ellipsis"}
                    >
                        {`${i.startAt} - ${i.endAt}`}
                    </Text>
                </GridItem>           
            )
        }
        {
            data?.map((i, index) => isWrapped(i.startAt, i.endAt) && <GridItem
                    bgColor={`${colors[index % colors.length]}.100`}
                    gridRow={getRow(i.startAt) + 2}
                    colSpan={getColSpan(i.startAt, i.endAt, true)}
                    colStart={1}
                    borderRightRadius={5}
                    my={3}
                    textColor={"gray.600"}
                    pt={1}
                    px={2}
                    mr={getMr(i.startAt, i.endAt, true)}
                    key={`${i.id}_wrapped`}
                />)
        }
        {
            Array.from(Array(Math.ceil(timeItems.length / COLS) + 1).keys()).map(i => <Divider
                position={"absolute"}
                top={`${100 * i}px`}
                left={0}
                right={0}
                borderColor={"gray.300"}
                zIndex={-1}
                key={i}
            />)
        }
        {
            Array.from(Array(COLS + 1).keys()).map(i => <Divider
                position={"absolute"}
                top={0}
                bottom={0}
                left={`${25 * i}%`}
                orientation="vertical"
                borderColor={"gray.300"}
                zIndex={-1}
                key={i}
            />)
        }
    </Grid>
}