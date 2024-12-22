import { AppointmentDto } from "@/services/client"
import { schedulesClient } from "@/services/services"
import { TIME_FORMAT } from "@/utils/constants"
import { nameof } from "@/utils/nameof"
import { Box, Flex, Grid, GridItem, Spinner, Text } from "@chakra-ui/react"
import moment from "moment"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useQuery } from "react-query"

const isInPeriodError = (startAt: string, endAt: string, appStartAt: string, appEndAt: string) => {
    const sa = moment(startAt, TIME_FORMAT)
    const ea = moment(endAt, TIME_FORMAT)
    const ast = moment(appStartAt, TIME_FORMAT)
    const aea = moment(appEndAt, TIME_FORMAT)

    return (ast.isSameOrAfter(sa) && ast.isSameOrBefore(ea))
        || (aea.isSameOrAfter(sa) && aea.isSameOrBefore(ea))
}

export const AvailableTime = () => {
    const {watch, getValues} = useFormContext()

    const scheduleId = watch(nameof<AppointmentDto>("scheduleId"))
    
    const startAt = watch(nameof<AppointmentDto>("startAt"))
    const endAt = watch(nameof<AppointmentDto>("endAt"))

    const {data, isLoading} = useQuery(
        ["get schedule periods", scheduleId],
        () => schedulesClient.getPeriods({scheduleId: scheduleId!, excludedId: getValues(nameof<AppointmentDto>("id"))}), {
        enabled: !!scheduleId
    })

    if(isLoading) {
        return <Spinner />
    }
    
    return <>
        {
            data && data.length > 0 && <Text mb={1}>
                Доступное время
            </Text>
        }
        <Grid borderRadius={"md"} mb={3} templateColumns={"repeat(2, 1fr)"} gap={1}>
            {
                data?.map((i, index) => <GridItem
                    // display={"flex"}
                    key={index}
                    h="70px"
                    px={3}
                    py={2}
                    border={"1px"}
                    borderColor={!!i.appointment ? "red.100" : "green.100"}
                    color={!!i.appointment ? "red.300" : "green.300"}
                    // shadow={!!i.appointment ? "lg" : undefined}
                    borderRadius={"md"}
                    colSpan={index % 2 == 0 && index == data.length - 1 ? 2 : undefined}
                    // border={!!i.appointment && isInPeriodError(i.startAt!, i.endAt!, startAt, endAt) ? "2px" : undefined} 
                    // borderColor={!!i.appointment ? "red.200" : undefined}
                >
                    <Text fontWeight={"bold"}>
                        {
                            `${i.startAt} - ${i.endAt}`
                        }
                    </Text>
                    <Text>
                        {
                            i?.appointment?.service?.name
                        }
                    </Text>
                </GridItem>)
            }
        </Grid>
        {
            // data && data
            //     .filter(i => !!i.appointment && isInPeriodError(i.startAt!, i.endAt!, startAt, endAt))
            //     .map((i, index) => <Text
            //         key={index}
            //         color="red.300"
            //         textAlign={"center"}
            //     >
            //         {`*${i.startAt} - ${i.endAt} ${i.appointment?.service?.name}`}
            //     </Text>)
        }
    </>
}