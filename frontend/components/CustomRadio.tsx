"use client"

import { Flex, Radio, RadioGroup, Text } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"

type RadioItem = {
    value: string
    label: string
}

type CustomRadioProps = {
    label: string
    name: string
    items: RadioItem[]
}

export const CustomRadio = ({label, name, items}: CustomRadioProps) => {
    const {control} = useFormContext()
    
    return <>
        <Text mb='8px'>{label}</Text>
        <Controller
            control={control}
            name={name}
            defaultValue={items[0].value}
            render={({field}) => <RadioGroup
                value={field.value}
                onChange={field.onChange}
                mb={1}
            >
                <Flex gap={3} flexWrap={"wrap"}>
                    {
                        items.map(i => <Radio
                            value={i.value}
                            key={i.value}
                        >{i.label}</Radio>)
                    }
                </Flex>
            </RadioGroup>}
        />
    </>
}