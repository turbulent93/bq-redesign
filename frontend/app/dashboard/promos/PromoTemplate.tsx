"use client"

import { PromoDto } from "@/services/client"
import { uploadClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { AspectRatio, Box, Button, Image, Text } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { useQuery } from "react-query"

const SERVER_URL = process.env.SERVER_URL!

export const PromoTemplate = () => {
    const {watch, getValues} = useFormContext()

    const {data} = useQuery(
        ["get file", watch(nameof<PromoDto>("imageId"))],
        () => uploadClient.view(getValues(nameof<PromoDto>("imageId"))), {
            enabled: !!watch(nameof<PromoDto>("imageId"))
        }
    )

    return <Box mx={4} mb={8}>
        <Box 
            borderRadius={14}
            border={"gray.600"}
            shadow={"lg"}
        >
            <AspectRatio ratio={3 / 2}>
                <Image
                    // src={data?.path ? `${SERVER_URL}/${data?.path}` : "/haircut.jpg"}
                    src={"/haircut.jpg"}
                    borderTopRadius={14}
                    w="100%"
                    objectFit={"cover"}
                />
            </AspectRatio>
            <Box p={5}>
                <Text
                    fontSize={24}
                    fontWeight={"bold"}
                    color={"gray.600"}
                    mb={2}
                >
                    {watch(nameof<PromoDto>("title")) || "Заголовок"}
                </Text>
                <Text mb={3}>
                    {watch(nameof<PromoDto>("description")) || "Описание"}
                </Text>
                <Button
                    bgGradient='linear(to-br, gray.700, red.500)'
                    textColor={"white"}
                >Записаться</Button>
            </Box>
        </Box>
    </Box>
}