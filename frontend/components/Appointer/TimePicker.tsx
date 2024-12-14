import { UpdateScheduleForm } from "@/app/dashboard/schedules/UpdateScheduleForm"
import { AppointmentDto, ScheduleTimeDto } from "@/services/client"
import { schedulesClient } from "@/services/services"
import { TIME_FORMAT } from "@/utils/constants"
import { nameof } from "@/utils/nameof"
import { Box, Flex, Grid, GridItem, Modal, ModalCloseButton, ModalContent, ModalOverlay, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react"
import moment from "moment"
import { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { FaExternalLinkAlt } from "react-icons/fa"
import { useQuery } from "react-query"
import { CustomModal } from "../CustomModal"
import { useWindowSize } from "@/app/Content"

const DEFAULT_START_HOUR = "8:00"
const DEFAULT_END_HOUR ="22:00"

const getTimeItems = (startAt: string, endAt: string) => {
    const items: ScheduleTimeDto[] = []
    const startHour = moment(startAt, TIME_FORMAT).hour()
    const endHour = moment(endAt, TIME_FORMAT).hour()
    const cur = moment({hours: startHour, minutes: 0})

    for (let i = 0; i < endHour - startHour; i++) {
        items.push({time: `${cur.hour()}:00`, isAvailable: false})
        cur.add(1, 'hours')
    }

    return items
}

type TimePickerProps = {
    scheduleId?: number
    duration?: number
    goToServiceStep: () => void
    goToNext: () => void
}

const END_WORK_HOUR = 17

const TimePickerContent = ({scheduleId, duration, goToServiceStep, goToNext}: TimePickerProps) => {
    const {data, isLoading} = useQuery(
        ["get schedule times", scheduleId, duration],
        () => schedulesClient.getTimes({scheduleId: scheduleId!, duration: duration!}), {
        enabled: !!scheduleId && !!duration
    })

    const [selectedValue, setSelectedValue] = useState<string>()

    const {watch, setValue} = useFormContext()

    const startAtChanged = watch(nameof<AppointmentDto>("startAt"))

    const toast = useToast()

    useEffect(() => {
        if(!selectedValue) return

        const startAt = moment(selectedValue, TIME_FORMAT)
        const endAt = startAt.add(duration!, "minutes")

        const requiredSlotsCount = endAt.hours() - startAt.hours()

        setValue(nameof<AppointmentDto>("startAt"), selectedValue)
        setValue(nameof<AppointmentDto>("endAt"), endAt.format(TIME_FORMAT))
        goToNext()
    }, [selectedValue])

    // useEffect(() => {
    //     console.log(scheduleId)
    //     setValue(nameof<AppointmentDto>("startAt"), undefined)
    //     setValue(nameof<AppointmentDto>("endAt"), undefined)
    // }, [scheduleId])

    if(isLoading)
        return  <Flex w="100%" justifyContent={"center"} alignItems="center" mt={4}>
            <Spinner />
        </Flex>

    if(!duration) {
        return <Flex
            w="100%"
            justifyContent={"center"}
            alignItems="center"
            cursor={"pointer"}
            gap={2}
        >
            <Text
                _hover={{textDecoration: "underline"}} 
                onClick={goToServiceStep}
            >
                Сначала выберите услугу
            </Text>
            <FaExternalLinkAlt />
        </Flex>
    }

    if(!scheduleId || !data) return

    return <Grid
            templateColumns={"repeat(4, 1fr)"}
            mt={[10, 24]}
            gap={3}
            w="100%"
            px={3}
            mb={1}
            userSelect={"none"}
            // h={`${Math.floor(data.length / 4)}px`}
            // h="400px"
        >
            {
                data?.map(i => <GridItem
                    h="50px"
                    py={2}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    key={i.time}
                    bgColor={startAtChanged == i.time ? "blue.100" : undefined}
                    opacity={!i.isAvailable ? "0.5" : undefined}
                    cursor={i.isAvailable ? "pointer" : undefined}
                    borderRadius={"md"}
                    onClick={() => i.isAvailable && setSelectedValue(i.time)}
                >{i.time}</GridItem>)
            }
        </Grid>
}

export const TimePicker = (props: TimePickerProps) => {
    const {isOpen, onOpen, onClose} = useDisclosure()

    const {w} = useWindowSize()

    useEffect(() => {
        if(props.scheduleId) 
            onOpen()
    }, [props.scheduleId])

    if(w && w < 700) {
        return <CustomModal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalCloseButton />
            <TimePickerContent {...props} />
        </CustomModal>
    }
    
    return <TimePickerContent {...props} />
}