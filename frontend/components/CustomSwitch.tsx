import { Switch, Text, Flex } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"

type CustomSwitchProps = {
    name: string
    label: string
}

export const CustomSwitch = ({name, label}: CustomSwitchProps) => {
    const {control, formState: {errors}} = useFormContext()

    return <Flex alignItems={"center"}>
        <Text>{label}</Text>
        <Controller
            name={name}
            control={control}
            render={({field}) => <Switch
                isChecked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                ml={2}
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
    </Flex>
}