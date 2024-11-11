import { Box, FormErrorMessage, Input, InputGroup, InputLeftElement, InputRightElement, Text, Textarea } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { DateInput } from "./DateInput"

type CustomInputProps = {
    label: string
    name: string
    required?: boolean
}

export const FormDateInput = ({label, name, required}: CustomInputProps) => {
    const {formState: {errors}, setValue, watch, getValues} = useFormContext()

    return <>
        <Text mb='8px'>{label}</Text>
        <Box className={!errors[name] ? "mb-3" : "mb-1"}>
            <DateInput
                value={{date: watch(name) || ""}}
                onChange={(value) => setValue(name, value?.date)}
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