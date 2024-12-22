import { useWindowSize } from "@/app/Content"
import { AppointmentDto } from "@/services/client"
import { appointmentsClient } from "@/services/services"
import { DATE_FORMAT, TIME_FORMAT } from "@/utils/constants"
import { Box, Center, Divider, Flex, Grid, GridItem, keyframes, Link, Text, VStack } from "@chakra-ui/react"
import moment from "moment"
import { useEffect, useMemo, useRef } from "react"
import { useQuery } from "react-query"
import { FcProcess } from "react-icons/fc";
import { IoMdTime } from "react-icons/io"
import { FaArrowsSpin } from "react-icons/fa6";
import { IoCheckmark } from "react-icons/io5"

type AppointmentsActivityProps = {
    data?: AppointmentDto[]
    collapsed?: boolean
}

const DEFAULT_START_HOUR = "8:00"
const DEFAULT_END_HOUR ="22:00"
const COL_HEIGHT = 120

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

const getColSpan = (startAt: string, endAt: string, isWrapped?: boolean, isMobile?: boolean) => {
    const end = moment(endAt, TIME_FORMAT)

    // if(isMobile) {
    //     return 1
    // }

    if(isWrapped) {
        // console.log((end.hours() - 9 + index) + (end.minutes() > 0 ? 1 : 0))
        // return (end.hours() - 9 + index) + (end.minutes() > 0 ? 1 : 0)
        return end.hours() % 4 + (end.minutes() > 0 ? 1 : 0)
    }

    // console.log((end.hours() - moment(startAt, TIME_FORMAT).hours()) + (end.minutes() > 0 ? 1 : 0))

    return (end.hours() - moment(startAt, TIME_FORMAT).hours()) + (end.minutes() > 0 ? 1 : 0)
}

const getRow = (startAt: string, isMobile?: boolean) => {
    const hours = moment(startAt, TIME_FORMAT).hours()

    if(isMobile) {
        // console.log(hours - 7)
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
        // console.log(((startMinutes / 60) * 50) + "px", startMinutes / 60, (startMinutes / 60) * 50)
        const m = (COL_HEIGHT / 60) * startMinutes
        return m == 0 ? "1" : m + "px"
    }

    // if(startAt == "11:10" || startAt == "14:10")
    //     console.log(startAt, `${startMinutes / (60 * colSpan) * 100}%`)

    // return "16%"

    // console.log(startMinutes, startMinutes / (60 * colSpan) * 100)
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
    const startTime = moment(startAt, TIME_FORMAT)
    const endMinutes = endTime.hours() > startTime.hours() && endTime.minutes() == 0
        ? 60
        : endTime.minutes()

    if(isMobile) {
        const m = (COL_HEIGHT / 60) * (60 - endMinutes)
        
        return m == 0 ? 1 : m + "px"
    }

    if(isNext) {
        return `${(60 - endTime.minutes()) / 60 * 100}%`
    }
    
    if(isWrapped(startAt, endAt)) {
        return 0
    }

    const colSpan = getColSpan(startAt, endAt)

    return `${(60 - endMinutes) / (60 * colSpan) * 100}%}`
}

const isInProcess = (startAt: string, endAt: string) => {
    const curTime = moment()//.set({hours: 12, minutes: 55})
    const startTime = moment(startAt, TIME_FORMAT)
    const endTime = moment(endAt, TIME_FORMAT)

    return curTime.isSameOrAfter(startTime) && curTime.isSameOrBefore(endTime)
}

const isCompleted = (endAt: string) => {
    const curTime = moment()//.set({hours: 12, minutes: 55})
    const endTime = moment(endAt, TIME_FORMAT)

    return curTime.isAfter(endTime)
}

const colors = ["red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink", "gray"]

export const AppointmentsActivity = ({data, collapsed = false}: AppointmentsActivityProps) => {
    const timeItems = getTimeItems(DEFAULT_START_HOUR, DEFAULT_END_HOUR)
    const COLS = 4
    const {w} = useWindowSize()
    const scrollRef = useRef<HTMLDivElement>(null)

    const isMobile = useMemo(() => collapsed ? collapsed : !!w && w < 840, [w, collapsed])

    const isToday = useMemo(() => {
        return data && data.length > 0
            && moment({
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0
            }).isSame(moment(data[0].schedule?.date, DATE_FORMAT))
    }, [data])

    useEffect(() => {
        if(isMobile) {
            const timeout = setTimeout(() => scrollRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                // inline: "start"
            }), 1000)

            return () => clearTimeout(timeout)
        }
    }, [data, isMobile])

    const spin = keyframes`  
        from {transform: rotate(0deg);}   
        to {transform: rotate(360deg)} 
    `;

    const scrollToId = useMemo(() => data?.reduce((p, c) => {
        const cst = moment(c.startAt, DATE_FORMAT)
        const pst = moment(p.startAt, DATE_FORMAT)
        
        const curTime = moment()

        return cst.isSameOrAfter(pst) && cst.isBefore(curTime) ? c : p
    }), [data])

    return <Box
        h={isMobile ? `401px` : undefined}
        // h={isMobile ? `${COL_HEIGHT * 4 + 1}px` : undefined}
        overflowX={isMobile ? "hidden" : undefined}
        overflowY={isMobile ? "auto" : undefined}
    > 
        <Grid
            templateColumns={!isMobile ? "repeat(4, 1fr)" : "60px 1fr"}
            gridTemplateRows={!isMobile ? `repeat(4, 20px ${COL_HEIGHT}px)` : `repeat(${timeItems.length}, ${COL_HEIGHT}px)`}
            // w={`calc(100% - 20px)`}
            position={"relative"}
        >
            {
                timeItems.map((i, index) => <GridItem
                    key={i}
                    border={"gray.600"}
                    gridRow={!isMobile ? ((index - index % 4) / 4) * 2 + 1 : undefined}
                    gridColumn={isMobile ? 1 : undefined}
                >
                    <Box>
                        <Text fontSize={14} textColor={"gray.600"} ml={2}>{i}</Text>
                    </Box>
                </GridItem>)
            }
            {
                data?.map((i, index) =>
                    <GridItem
                        ref={isMobile && i.id == scrollToId?.id ? scrollRef : undefined}
                        m={1}
                        bgColor={`${colors[index % colors.length]}.100`}
                        gridRow={!isMobile ? getRow(i.startAt, isMobile) : undefined}
                        colSpan={!isMobile ? getColSpan(i.startAt, i.endAt) : undefined}
                        colStart={!isMobile ? getColStart(i.startAt, isMobile) : undefined}
                        rowStart={getColStart(i.startAt, isMobile)}
                        gridColumn={isMobile ? 2 : undefined}
                        gridRowStart={!isMobile ? undefined : getRow(i.startAt, isMobile)}
                        rowSpan={!isMobile ? undefined : getColSpan(i.startAt, i.endAt, undefined, isMobile)}
                        borderLeftRadius={5}
                        borderRightRadius={isWrapped(i.startAt, i.endAt, isMobile) ? 0 : 5}
                        textColor={"gray.600"}
                        py={1}
                        px={2}
                        ml={!isMobile ? getMl(i.startAt, i.endAt) : undefined}
                        mr={!isMobile ? getMr(i.startAt, i.endAt) : undefined}
                        mt={isMobile ? getMl(i.startAt, i.endAt, isMobile) : undefined}
                        mb={isMobile ? getMr(i.startAt, i.endAt, undefined, isMobile) : undefined}
                        key={i.id}
                        bgSize={"400% 400%"}
                        bgGradient={isMobile && isInProcess(i.startAt, i.endAt) ? `linear(to-br, gray.700, red.500)` : undefined}
                        animation={isMobile && isInProcess(i.startAt, i.endAt) ? "gradient 12s ease infinite" : undefined}
                        color={isMobile && isInProcess(i.startAt, i.endAt) ? "white" : undefined}
                        position={"relative"}
                    >
                        <Flex
                            flexDir={!isMobile ? "column" : undefined}
                            gap={1}
                            alignItems={"start"}
                            justifyContent={"space-between"}
                            h="100%"
                        >
                            <Box>
                                <Link
                                    fontSize={isMobile ? 20 : 16} 
                                    whiteSpace={"nowrap"}
                                    overflow={"hidden"}
                                    textOverflow={"ellipsis"}
                                    fontWeight={"bold"}
                                    href={`appointments/update?id=${i.id}`}
                                >
                                    {i.service?.name}
                                </Link>
                                <Text
                                    fontSize={isMobile ? 16 : 12}
                                    whiteSpace={"nowrap"}
                                    overflow={"hidden"}
                                    textOverflow={"ellipsis"}
                                >
                                    {`${i.startAt} - ${i.endAt}`}
                                </Text>
                            </Box>
                            {
                                isToday && isCompleted(i.endAt)
                                    ? <Box
                                        // bgColor={"gray.700"}
                                        gap={1}
                                        alignItems="center"
                                        borderRadius={"md"}
                                        p={1}
                                        // color="white"
                                        ml="auto"
                                        mt={"auto"}
                                    >
                                        <IoCheckmark size={22} />
                                    </Box>
                                    : isToday && isInProcess(i.startAt, i.endAt) && <VStack
                                        // bgColor={"gray.100"}
                                        gap={1}
                                        alignItems="center"
                                        borderRadius={"md"}
                                        p={1}
                                        // color="white"
                                        ml="auto"
                                        mt={"auto"}
                                    >
                                        <Box animation={`${spin} infinite 2s linear`}>
                                            <FaArrowsSpin size={22} />
                                        </Box>
                                    </VStack>
                            }
                        </Flex>
                        {/* <Center> */}
                            {/* <VStack spacing={20} position={"absolute"} top={2} right={2}>
                                <Box animation={`${spin} infinite 2s linear`} color="red.700">
                                    <FcProcess size={28} color="black"/>
                                </Box>
                            </VStack> */}
                        {/* </Center> */}
                        {
                            // isInProcess(i.startAt, i.endAt) && <Box position={"absolute"} top={2} right={2}>
                            //     {/* <IoMdTime size={28} /> */}
                            //     <FaArrowsSpin size={28}/>
                            // </Box>
                        }
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
                    top={`${(COL_HEIGHT + (!isMobile ? 20 : 0)) * i}px`}
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
    </Box>
}