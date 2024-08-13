import { Box, Flex, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Text } from "@chakra-ui/react"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form";

const convertTime = (value: number) => {
    var hours = Math.floor(value / 60);          
    var minutes = value % 60;

    if(hours > 0) {
        if(minutes == 0) {
            return `${hours} ч.`
        }
        return `${hours} ч. ${minutes} мин.`
    }
    return `${minutes} мин.`
}

type TimeSliderProps = {
    label: string,
    name: string
}

export const TimeSlider = ({name, label}: TimeSliderProps) => {
    const {control,} = useFormContext()

    return (
        <>
            <Text mb='4px'>{label}</Text>
            <Controller
                name={name}
                control={control}
                defaultValue={30}
                render={({field}) => <Flex p={4} alignItems={"center"}>
                    <Slider
                        onChange={(val) => field.onChange(val)}
                        value={field.value}
                        step={10}
                        max={120}
                        min={10}
                        className="mb-3"
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                    <Text w="140px" textAlign={"right"}>
                        {convertTime(field.value)}
                    </Text>
                </Flex>}
            />
        </>
    )
}