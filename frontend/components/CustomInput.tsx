import { FormErrorMessage, Input, InputGroup, InputLeftElement, InputRightElement, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, Textarea } from "@chakra-ui/react"
import { useEffect } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { FaPhone } from "react-icons/fa"

const phoneMask = (value: string) => {
    const phone = value.replace(/^8|[^_^\d]/g, "")

    if(phone.length == 0) {
        return ""
    }

    if(phone.length < 4) {
        return "8 (" + phone
    }

    if(phone.length < 7) {
        return "8 (" + phone.slice(0, 3) + ") " + phone.slice(3)
    }

    return "8 (" + phone.slice(0, 3) + ") " + phone.slice(3, 6) + "-" + phone.slice(6, 10)
}

const numberMask = (value: string, max?: number, min?: number) => {
    const number = value.match(/\d+/g)

    if(!number || number.length == 0) return ""

    if(max && Number(number[0]) > max) return max

    if(min && Number(number[0]) < min) return min

    return number[0]
}

type CustomInputProps = {
    label: string
    name: string
    rightElement?: React.ReactNode
    type?: "text" | "number" | "password" | "textarea" | "phone",
    required?: boolean
    forceReset?: boolean
    defaultValue?: string
    min?: number
    max?: number
    variant?: "flushed"
    labelColor?: string
    focusBorderColor?: string
    color?: string
}

export const CustomInput = ({label, name, rightElement, type, required, forceReset, defaultValue, min, max, variant, labelColor, focusBorderColor, color}: CustomInputProps) => {
    const {register, formState: {errors}, setValue, watch, control, reset, getValues} = useFormContext()

    const watchedValue = watch(name)

    useEffect(() => {
        if(forceReset)
            setValue(name, watchedValue)
    }, [watchedValue])

    useEffect(() => {
        if(defaultValue)
            reset({...getValues(), [name]: defaultValue})
    }, [defaultValue])

    return <>
        <Text color={labelColor} mb={1}>{label}</Text>
        <InputGroup mb={errors[name] ? 1 : 3}>
            {
                type == "textarea" ?    
                <Textarea
                    placeholder="Не заполнено"
                    isInvalid={!!errors[name]}                    
                    errorBorderColor="red.300"
                    variant={variant}
                    focusBorderColor={focusBorderColor}
                    color={color}
                    {...register(name, required ? {required: "*Обязательное поле"} : undefined)}
                /> : 
                type == "number" ?
                <Controller
                    control={control}
                    name={name}
                    rules={{required: "*Обязательное поле"}}
                    render={({field}) => <NumberInput
                        value={field.value || ""}
                        onChange={v => field.onChange(numberMask(v, max, min))}
                        mb={2}
                        max={max}
                        min={min}
                        w="100%"
                        errorBorderColor="red.300"
                        variant={variant}
                        focusBorderColor={focusBorderColor}
                        color={color}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                        </NumberInput>
                    }
                /> :
                type == "phone" ? <Controller
                    name={name}
                    control={control}
                    rules={{required: "*Обязательное поле"}}
                    render={({field}) => <Input
                        placeholder="Не заполнено"
                        isInvalid={!!errors[name]}
                        errorBorderColor="red.300"
                        value={field.value || ""}
                        onChange={e => field.onChange(phoneMask(e.target.value))}
                        variant={variant}
                        focusBorderColor={focusBorderColor}
                        color={color}
                    />}
                /> :
                <Input
                    placeholder="Не заполнено"
                    type={type}
                    isInvalid={!!errors[name]}
                    errorBorderColor="red.300"
                    {...register(name, required ? {required: "*Обязательное поле"} : undefined)}
                    variant={variant}
                    focusBorderColor={focusBorderColor}
                    color={color}
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