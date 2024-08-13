import { Scheduler } from "@/components/Scheduler/Scheduler"
import { AppointmentDto } from "@/services/client"
import { nameof } from "@/utils/nameof"
import { Flex } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { TimePicker } from "./TimePicker"

type ScheduleStepProps = {
    duration?: number
    goToServiceStep: () => void
    goToNext: () => void
}

export const ScheduleStep = ({duration, goToServiceStep, goToNext}: ScheduleStepProps) => {
    const {setValue, watch} = useFormContext()

    const handler = (value: number) => {
        setValue(nameof<AppointmentDto>("scheduleId"), value)
    }

    const scheduleId = watch(nameof<AppointmentDto>("scheduleId")) 

    return <Flex gap={4}>
        <Scheduler
            onChange={(value) => {
                handler(value.scheduleId!)
                setValue(nameof<AppointmentDto>("startAt"), undefined)
                setValue(nameof<AppointmentDto>("endAt"), undefined)
            }}
            value={scheduleId}
            duration={duration}
            contentType="SLOTS"
            isDatePick
        />
        <TimePicker
            scheduleId={scheduleId}
            duration={duration}
            goToServiceStep={goToServiceStep}
            goToNext={goToNext}
        />
    </Flex>
}