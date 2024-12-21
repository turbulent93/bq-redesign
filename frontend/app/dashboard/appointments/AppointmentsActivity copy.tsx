import { useWindowSize } from "@/app/Content"
import { AppointmentDto } from "@/services/client"
import { TIME_FORMAT } from "@/utils/constants"
import { Box, Divider, Grid, GridItem, Text } from "@chakra-ui/react"
import moment from "moment"
import { useMemo } from "react"

type AppointmentsActivityProps = {
    data?: AppointmentDto[]
}

const DEFAULT_START_HOUR = "8:00"
const DEFAULT_END_HOUR ="22:00"

const getTimeItems = (startAt: string, endAt: string) => {
    const items = []
    const startHour = moment(startAt, TIME_FORMAT).hour()
    const endHour = moment(endAt, TIME_FORMAT).hour()
    const cur = moment({hours: startHour, minutes: 0})

    for (let i = 0; i <= endHour - startHour; i++) {
        items.push(`${cur.hour()}:00`)
        cur.add(1, 'hours')
    }

    return items
}

const getColSpan = (startAt: string, endAt: string, isWrapped?: boolean) => {
    const end = moment(endAt, TIME_FORMAT)

    if(isWrapped) {
        return end.hours() % 4 + (end.minutes() > 0 ? 1 : 0)
    }

    return (end.hours() - moment(startAt, TIME_FORMAT).hours()) + (end.minutes() > 0 ? 1 : 0)
}

const getRow = (startAt: string, isMobile?: boolean) => {
    const hours = moment(startAt, TIME_FORMAT).hours()

    if(isMobile) {
        return hours - 7
    }

    if(hours < 12)
        return 2
    else if(hours < 16)
        return 4
    else if(hours < 20)
        return 6
    else
        return 8
}

const isWrapped = (startAt: string, endAt: string, isMobile?: boolean) => {
    const endTime = moment(endAt, TIME_FORMAT)
    const startTime = moment(startAt, TIME_FORMAT)

    if(isMobile) {
        return false
    }

    return getColStart(startAt) == 4 && endTime.hours() > startTime.hours() && endTime.minutes() != 0
}

const getMl = (startAt: string, endAt: string, isMobile?: boolean) => {
    const colSpan = isWrapped(startAt, endAt) ? 1 : getColSpan(startAt, endAt)
    const startMinutes = moment(startAt, TIME_FORMAT).minutes()

    if(isMobile) {
        return ((100 / 60) * startMinutes) + "px"
    }

    return `${startMinutes / (60 * colSpan) * 100}%`
}

const getColStart = (startAt: string, isMobile?: boolean) => {
    const hour = moment(startAt, TIME_FORMAT).hours()

    if(isMobile) {
        return hour + 1
    }

    return hour % 4 + 1
}

const getMr = (startAt: string, endAt: string, isNext?: boolean, isMobile?: boolean) => {
    const endTime = moment(endAt, TIME_FORMAT)

    if(isMobile) {
        return (100 / 60) * (60 - endTime.minutes()) + "px"
    }

    if(isNext) {
        return `${(60 - endTime.minutes()) / 60 * 100}%`
    }
    
    if(isWrapped(startAt, endAt)) {
        return 0
    }

    const startTime = moment(startAt, TIME_FORMAT)
    const colSpan = getColSpan(startAt, endAt)
    const endMinutes = endTime.hours() > startTime.hours() && endTime.minutes() == 0
        ? 60
        : endTime.minutes()

    return `${(60 - endMinutes) / (60 * colSpan) * 100}%}`
}   

const colors = ["red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink", "gray"]

export const AppointmentsActivity = ({data}: AppointmentsActivityProps) => {
    const timeItems = getTimeItems(DEFAULT_START_HOUR, DEFAULT_END_HOUR)
    const COLS = 4
    const {w} = useWindowSize()

    const isMobile = useMemo(() => !!w && w < 840, [w])

    return <Grid
        minW={!isMobile ? "800px" : undefined}
        templateColumns={!isMobile ? "repeat(4, 1fr)" : "60px 1fr"}
        gridTemplateRows={!isMobile ? `repeat(${timeItems.length}, 20px 80px)` : `repeat(${timeItems.length}, 100px)`}
        w="calc(100% - 2px)"
        position={"relative"}
    >
        {
            timeItems.map((i, index) => <GridItem
                key={i}
                border={"gray.600"}
                gridRow={((index - index % 4) / 4) * 2 + 1}
                gridColumn={1}
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
                    gridRow={!isMobile ? getRow(i.startAt, isMobile) : undefined}
                    colSpan={!isMobile ? getColSpan(i.startAt, i.endAt) : undefined}
                    colStart={!isMobile ? getColStart(i.startAt, isMobile) : undefined}
                    gridRowStart={!isMobile ? undefined : getRow(i.startAt, isMobile)}
                    rowSpan={!isMobile ? undefined : getColSpan(i.startAt, i.endAt)}
                    borderLeftRadius={5}
                    borderRightRadius={isWrapped(i.startAt, i.endAt, isMobile) ? 0 : 5}
                    textColor={"gray.600"}
                    py={1}
                    px={2}
                    ml={!isMobile ? getMl(i.startAt, i.endAt) : undefined}
                    mr={isMobile ? getMr(i.startAt, i.endAt) : undefined}
                    mt={isMobile ? getMl(i.startAt, i.endAt, isMobile) : undefined}
                    mb={isMobile ? getMr(i.startAt, i.endAt, undefined, isMobile) : undefined}
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
            Array.from(Array(Math.ceil(timeItems.length / (!isMobile ? COLS : 1)) + 1).keys()).map(i => <Divider
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
            Array.from(Array((!isMobile ? COLS : 1) + 1).keys()).map(i => <Divider
                position={"absolute"}
                top={0}
                bottom={0}
                left={`${(!isMobile ? 25 : 100) * i}%`}
                orientation="vertical"
                borderColor={"gray.300"}
                zIndex={-1}
                key={i}
            />)
        }
    </Grid>
}