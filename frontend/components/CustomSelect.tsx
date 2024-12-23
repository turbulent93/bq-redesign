import { Text } from "@chakra-ui/react"
import { Select } from "chakra-react-select"
import { useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

type CustomSelectItem = {label: string, value: any}

type CustomSelectProps = {
    options?: CustomSelectItem[]
    defaultValue?: CustomSelectItem | CustomSelectItem[]
    label: string
    name: string
    required?: boolean
    multiple?: boolean
}

export const CustomSelect = ({options, label, name, required, multiple ,defaultValue}: CustomSelectProps) => {
    const {control, formState: {errors}, reset, getValues} = useFormContext()

    useEffect(() => {
        reset({...getValues(), [name]: defaultValue})
    }, [defaultValue])

    return <>
        <Text mb='8px'>{label}</Text>
        <Controller
            control={control}
            name={name}
            rules={required ? {required: "*Обязательное поле"} : undefined}
            render={({field}) => <Select
                className={!errors[name] ? "mb-3" : "mb-1"}
                options={options}
                placeholder="Не заполнено"
                isMulti={multiple}
                closeMenuOnSelect={!multiple}
                value={
                    field.value
                        ? multiple
                            ? options?.filter(i => (field.value as number[]).includes(i.value))
                            : options?.find(i => i.value == field.value)
                        : undefined
                }
                onChange={(value) => field.onChange(multiple
                    ? (value as CustomSelectItem[]).map(i => i.value)
                    : (value as CustomSelectItem).value)}
                ref={field.ref}
                name={field.name}
                errorBorderColor="red.300"
                isInvalid={!!errors[name]}
                // onChange={(value) => field.onChange(multiple ? value.map((i: CustomSelectItem) => i.value) : value.value)}
            />}
        />
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