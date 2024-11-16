import { FormErrorMessage, Input, InputGroup, InputLeftElement, InputRightElement, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, Textarea } from "@chakra-ui/react"
import { useEffect } from "react"
import { Controller, useFormContext } from "react-hook-form"

type CustomInputProps = {
    label: string
    name: string
    rightElement?: React.ReactNode
    type?: "text" | "number" | "password" | "textarea",
    required?: boolean
    forceReset?: boolean
    defaultValue?: string | number
    min?: number
    max?: number
}

export const CustomInput = ({label, name, rightElement, type, required, forceReset, defaultValue, min, max}: CustomInputProps) => {
    const {register, formState: {errors}, setValue, watch, control, reset, getValues} = useFormContext()

    const watchedValue = watch(name)

    useEffect(() => {
        if(forceReset)
            setValue(name, watchedValue)
    }, [watchedValue])

    useEffect(() => {
        if(defaultValue)
            reset({...getValues(), [name]: defaultValue})
    }, [])

    return <>
        <Text mb='8px'>{label}</Text>
        <InputGroup className={!errors[name] ? "mb-3" : "mb-1"}>
            {
                type == "textarea" ? 
                <Textarea
                    placeholder="Не заполнено"
                    isInvalid={!!errors[name]}                    
                    errorBorderColor="red.300"
                    {...register(name, required ? {required: "*Обязательное поле"} : undefined)}
                /> : 
                type == "number" ?
                <Controller
                    control={control}
                    name={name}
                    rules={{required: "*Обязательное поле"}}
                    render={({field}) => <NumberInput
                        value={field.value}
                        onChange={field.onChange}
                        mb={2}
                        max={max}
                        min={min}
                        w="100%"
                        errorBorderColor="red.300"
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                        </NumberInput>
                    }
                /> :
                <Input
                    placeholder="Не заполнено"
                    type={type}
                    isInvalid={!!errors[name]}
                    errorBorderColor="red.300"
                    {...register(name, required ? {required: "*Обязательное поле"} : undefined)}
                />
            }
            {
                rightElement && <InputRightElement pointerEvents='none' color='gray.300' fontSize='1.2em'>
                    {rightElement}
                </InputRightElement>
            }
        </InputGroup>
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