"use client"

import { PromoCard } from "@/components/cards/PromoCard"
import { PromoDto } from "@/services/client"
import { uploadClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { AspectRatio, Box, Button, Image, Text } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { useQuery } from "react-query"

const SERVER_URL = process.env.SERVER_URL!

export const PromoTemplate = () => {
    const {watch, getValues} = useFormContext()

    const imageId = watch(nameof<PromoDto>("imageId"))

    const {data} = useQuery(["view file", imageId], () => uploadClient.view(imageId), {
        enabled: !!imageId
    })

    return <Box mx={4} mb={8}>
        <PromoCard
            image={data?.path ? `${SERVER_URL}/${data?.path}` : undefined}
            title={watch(nameof<PromoDto>("title"))}
            description={watch(nameof<PromoDto>("description"))}
            startDate={watch(nameof<PromoDto>("startDate"))}
            endDate={watch(nameof<PromoDto>("endDate"))}
        />
    </Box>
}