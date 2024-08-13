import { Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"
import { FaPhone } from "react-icons/fa"

const mask = (value: string) => {
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

type PhoneInputProps = {
    name: string
}

export const PhoneInput = ({name}: PhoneInputProps) => {
    const {control, formState: {errors}} = useFormContext()

    return <>
        <Text mb='8px'>Номер телефона</Text>
        <Controller
            name={name}
            control={control}
            rules={{required: "*Обязательное поле"}}
            render={({field}) => <InputGroup className={!errors[name] ? "mb-3" : "mb-1"}>
                <Input
                    placeholder="Не заполнено"
                    isInvalid={!!errors[name]}
                    errorBorderColor="red.300"
                    value={field.value || ""}
                    onChange={e => field.onChange(mask(e.target.value))}
                />
                <InputLeftElement pointerEvents='none' color='gray.300' fontSize='1.2em'>
                    <FaPhone />
                </InputLeftElement>
            </InputGroup>}
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