import { Box, Text } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"
import { Scheduler, SchedulerValue } from "./Scheduler/Scheduler"
import { useState } from "react"
import { useQuery } from "react-query"
import { servicesClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { AppointmentDto } from "@/services/client"

type CustomInputProps = {
    label: string
    name: string
    required?: boolean
    type?: "date" | "schedule"
    // userId?: number
}

export const FormDateInput = ({label, name, required, type = "date"}: CustomInputProps) => {
    const {formState: {errors}, control, watch} = useFormContext()

    const [schedulerValue, setSchedulerValue] = useState<SchedulerValue>()

    const employeeId = watch(nameof<AppointmentDto>("employeeId"))

    return <>
        <Text mb='8px'>{label}</Text>
        <Box mb={3}>
            <Controller
                    control={control}
                    name={name}
                    rules={required ? {required: "*Обязательное поле"} : undefined}
                    render={({field}) => <Scheduler
                        value={{
                            ...schedulerValue,
                            [type == "date" ? "date" : "scheduleId"]: field.value
                        }}
                        onChange={(v) => {
                            console.log(v)
                            setSchedulerValue(v)
                            if(type == "date") {
                                field.onChange(v.date)
                            } else {
                                field.onChange(v.scheduleId)
                            }
                        }}
                        contentType="WORK_TIME"
                        collapsed
                        userId={employeeId}
                    />}
            />
        </Box>
        {
            errors[name] ?
                <Text
                    color="red.300"
                    fontSize={12}
                    mb={3}
                >{String(errors[name]?.message)}</Text> :
                undefined
        }
    </>
}