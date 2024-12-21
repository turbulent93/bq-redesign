import { TimeSelect } from "@/components/TimeSelect"
import { AppointmentDto } from "@/services/client"
import { servicesClient } from "@/services/services"
import { TIME_FORMAT } from "@/utils/constants"
import { nameof } from "@/utils/nameof"
import moment from "moment"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useQuery } from "react-query"

export const EndTime = () => {
    const {watch, reset, getValues} = useFormContext()

    const startAt = watch(nameof<AppointmentDto>("startAt"))
    const serviceId = watch(nameof<AppointmentDto>("serviceId"))
    // const scheduleId = watch(nameof<AppointmentDto>("scheduleId"))

    const {data: service} = useQuery(
        ["view service", serviceId],
        () => servicesClient.view(serviceId), {
            enabled: !!serviceId
        }
    )

    useEffect(() => {
        reset({
            ...getValues(),
            [nameof<AppointmentDto>("endAt")]: !!service && !getValues(nameof<AppointmentDto>("endAt"))
                ? moment(startAt, TIME_FORMAT)
                    .add(service?.duration, "minutes")
                    .format(TIME_FORMAT)
                : getValues(nameof<AppointmentDto>("endAt"))
        })
    }, [startAt])

    return <TimeSelect
        name={nameof<AppointmentDto>("endAt")}
        label="Время окончания"
    />
}