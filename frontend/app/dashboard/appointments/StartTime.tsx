import { TimeSelect } from "@/components/TimeSelect"
import { AppointmentDto } from "@/services/client"
import { schedulesClient, servicesClient } from "@/services/services"
import { TIME_FORMAT } from "@/utils/constants"
import { nameof } from "@/utils/nameof"
import moment from "moment"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useQuery } from "react-query"

export const StartTime = () => {
    const {watch, reset, getValues} = useFormContext()

    const scheduleId = watch(nameof<AppointmentDto>("scheduleId"))
    const startAt = watch(nameof<AppointmentDto>("startAt"))

    const {data: schedule} = useQuery(
        ["view schedule", scheduleId],
        () => schedulesClient.view(scheduleId), {
            enabled: !!scheduleId
        }
    )

    useEffect(() => {
        reset({
            ...getValues(),
            [nameof<AppointmentDto>("startAt")]: !!startAt ? startAt : schedule?.startAt
        })
    }, [scheduleId])

    return <TimeSelect
        name={nameof<AppointmentDto>("startAt")}
        label="Время начала"
    />
}