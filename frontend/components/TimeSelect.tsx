import { Flex, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"

import { defaultTheme, Select } from "chakra-react-select"
import { Controller, useFormContext } from "react-hook-form"
import moment from "moment"
import { TIME_FORMAT } from "@/utils/constants"

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

    const getHour = (value: string) => {
        const hour = moment(value, TIME_FORMAT).hours()
    
        return hours.find(i => i.value == String(hour))
    }

    const setHour = (value: string, hoursToAdd: number) => {
        const m = !!value ? moment(value, TIME_FORMAT) : moment().set("minutes", 0)

        return m
            .set("hour", hoursToAdd)
            .format(TIME_FORMAT)
    }

    const getMinutes = (value: string) => {
        const minute = moment(value, TIME_FORMAT).minutes()

        return minutes.find(i => i.value == (minute == 0 ? "00" : String(minute)))
    }

    const setMinutes = (value?: string, minutesToAdd?: number) => {
        const m = !!value ? moment(value, TIME_FORMAT) : moment()

        return m.set("minutes", minutesToAdd!).format(TIME_FORMAT)
    }

    return <>
        <Text mb={1}>{label}</Text>
        <Controller
            name={name}
            control={control}
            // defaultValue={defaultValue}
            render={({field}) => <Flex w="300px" gap={2} alignItems={"center"} mb={3}>
                <Select
                    options={hours}
                    value={getHour(field.value)}
                    onChange={(value) => field.onChange(setHour(field.value, Number(value?.value)))}
                    useBasicStyles
                    placeholder="Часы"
                />
                :
                <Select
                    options={minutes}
                    value={getMinutes(field.value)}
                    onChange={(value) => field.onChange(setMinutes(field.value, Number(value?.value)))}
                    useBasicStyles
                    placeholder="Минуты"
                />
            </Flex>}
        />
    </>
}