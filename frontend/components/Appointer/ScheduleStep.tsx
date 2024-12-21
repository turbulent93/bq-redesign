import { Scheduler, SchedulerValue } from "@/components/Scheduler/Scheduler"
import { AppointmentDto } from "@/services/client"
import { nameof } from "@/utils/nameof"
import { Flex, useDisclosure } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { TimePicker } from "./TimePicker"
import { useQuery } from "react-query"
import { promosClient } from "@/services/services"
import { useEffect, useState } from "react"

type ScheduleStepProps = {
    duration?: number
    goToServiceStep: () => void
    goToNext: () => void
    promoId?: number
}

export const ScheduleStep = ({duration, goToServiceStep, goToNext, promoId}: ScheduleStepProps) => {
    const {setValue, watch} = useFormContext()

    const handler = (value: number) => {
        setValue(nameof<AppointmentDto>("scheduleId"), value)
    }

    const scheduleId = watch(nameof<AppointmentDto>("scheduleId")) 
    const employeeId = watch(nameof<AppointmentDto>("employeeId")) 

	const {data} = useQuery(
        ["view promo", promoId],
        () => promosClient.view(Number(promoId)), {
            enabled: !!promoId
        }
    )

    const {isOpen, onOpen, onClose} = useDisclosure()

    const [schedulerValue, setSchedulerValue] = useState<SchedulerValue | undefined>()

    useEffect(() => {
        // if(!promoId)
        setSchedulerValue(undefined)
    }, [promoId])

    return <Flex gap={4}>
        <Scheduler
            onChange={(value) => {
                handler(value.scheduleId!)
                setValue(nameof<AppointmentDto>("startAt"), undefined)
                setValue(nameof<AppointmentDto>("endAt"), undefined)

                setSchedulerValue(value)

                if(value.scheduleId)
                    onOpen()
            }}
            value={{scheduleId: Number(scheduleId), date: schedulerValue?.date}}
            duration={duration}
            contentType="SLOTS"
            allowedWeekDays={promoId ? data?.allowedWeekDays : undefined}
            isDatePick
            startAt={promoId ? data?.startAt : undefined}
            endAt={promoId ? data?.endAt : undefined}
            userId={employeeId}
        />
        <TimePicker
            scheduleId={scheduleId}
            duration={duration}
            goToServiceStep={goToServiceStep}
            goToNext={goToNext}
            isOpen={isOpen}
            onClose={onClose}
            startAt={promoId ? data?.startAt : undefined}
            endAt={promoId ? data?.endAt : undefined}
        />
    </Flex>
}