import { FormErrorMessage, Input, InputGroup, InputLeftElement, InputRightElement, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

type CustomInputProps = {
    label: string
    name: string
    rightElement?: React.ReactNode
    type?: "text" | "number" | "password",
    required?: boolean
    forceReset?: boolean
}

export const CustomInput = ({label, name, rightElement, type, required, forceReset}: CustomInputProps) => {
    const {register, formState: {errors}, setValue, watch} = useFormContext()

    const watchedValue = watch(name)

    useEffect(() => {
        if(forceReset)
            setValue(name, watchedValue)
    }, [watchedValue])

    return <>
        <Text mb='8px'>{label}</Text>
        <InputGroup className={!errors[name] ? "mb-3" : "mb-1"}>
            <Input
                placeholder="Не заполнено"
                type={type}
                isInvalid={!!errors[name]}
                
                errorBorderColor="red.300"
                {...register(name, required ? {required: "*Обязательное поле"} : undefined)}
            />
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