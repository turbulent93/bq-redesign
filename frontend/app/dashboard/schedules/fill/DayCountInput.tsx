import { FillScheduleDto } from "@/services/client"
import { nameof } from "@/utils/nameof"
import { Box, Flex, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from "@chakra-ui/react"
import moment from "moment"
import { useFormContext } from "react-hook-form"

type DayCountInputProps = {

}

export const DayCountInput = () => {
    const {register} = useFormContext()

    return <Flex gap={3} mb={1}>
        <Box>
            <Text mb='8px'>Рабочие дни</Text>
            <NumberInput min={1} max={moment().endOf("month").day() - 1}>
                <NumberInputField {...register(nameof<FillScheduleDto>("workDays"))} />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </Box>
        <Box>
            <Text mb='8px'>Выходные дни</Text>
            <NumberInput min={1} max={moment().endOf("month").day() - 1}>
                <NumberInputField {...register(nameof<FillScheduleDto>("weekendDays"))} />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </Box>
    </Flex>
}