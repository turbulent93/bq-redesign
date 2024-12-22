import { Box, Text } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"
import { Scheduler, SchedulerValue } from "./Scheduler/Scheduler"
import { useState } from "react"
import { useQuery } from "react-query"
import { servicesClient } from "@/services/services"

type CustomInputProps = {
    label: string
    name: string
    required?: boolean
    type?: "date" | "schedule"
    userId?: number
}

export const FormDateInput = ({label, name, required, type = "date", userId}: CustomInputProps) => {
    const {formState: {errors}, control, watch} = useFormContext()

    const [schedulerValue, setSchedulerValue] = useState<SchedulerValue>()

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
                        userId={userId}
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