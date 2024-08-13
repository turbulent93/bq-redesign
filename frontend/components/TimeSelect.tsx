import { Flex, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"

import { defaultTheme, Select } from "chakra-react-select"
import { Controller, useFormContext } from "react-hook-form"
import moment from "moment"

type TimeSelectProps = {
    name: string
    label: string
    defaultValue?: string
}

const getHours = () => {
    return Array
        .from({length: 13}, (_, index) => index + 8)
        .map(i => ({value: String(i), label: String(i)}))
}

const getTimes = () => {
    return Array
        .from({length: 6}, (_, index) => index * 10)
        .map(i => ({value: i == 0 ? "00" : String(i), label: i == 0 ? "00" : String(i)}))
}

export const TimeSelect = ({label, name, defaultValue}: TimeSelectProps) => {
    // const [value, setValue] = useState<string>()

    const {control} = useFormContext()

    const hours = getHours()
    const minutes = getTimes()

    const defaultTime = moment(defaultValue, "HH:mm")

    const getHour = (value: string) => {
        // const hour = value
        //     ? moment(value, "HH:mm").hours()
        //     : defaultTime.hours()
        const hour = moment(value, "HH:mm").hours()
    
        return hours.find(i => i.value == String(hour))
    }

    const setHour = (value: string, hoursToAdd: number) => {
        return moment(value, "HH:mm").set("hour", hoursToAdd).format("HH:mm")
    }

    const getMinutes = (value: string) => {
        // const minute = value
        //     ? moment(value, "HH:mm").minutes()
        //     : defaultTime.minutes()
        const minute = moment(value, "HH:mm").minutes()

        return minutes.find(i => i.value == (minute == 0 ? "00" : String(minute)))
    }

    const setMinutes = (value: string, minutesToAdd: number) => {
        return moment(value, "HH:mm").set("minutes", minutesToAdd).format("HH:mm")
    }

    return <>
        <Text mb="8px">{label}</Text>
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({field}) => <Flex w="300px" gap={2} alignItems={"center"} mb={1}>
                <Select
                    options={hours}
                    value={getHour(field.value)}
                    onChange={(value) => field.onChange(setHour(field.value, Number(value?.value)))}
                    useBasicStyles
                />
                :
                <Select
                    options={minutes}
                    value={getMinutes(field.value)}
                    onChange={(value) => field.onChange(setMinutes(field.value, Number(value?.value)))}
                    useBasicStyles
                />
            </Flex>}
        />
    </>
}