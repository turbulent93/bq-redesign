"use client"

import { Scheduler, SchedulerValue } from "@/components/Scheduler/Scheduler"
import { AppointmentDto } from "@/services/client"
import { appointmentsClient } from "@/services/services"
import { useAuth } from "@/utils/useAuth"
import { Box, Card, CardBody, CardHeader, Flex, Heading, Spinner, Stack, StackDivider, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"

type AppointmentsToRemoveProps = {
    data?: number[]
}

export const AppointmentsToRemove = ({data}: AppointmentsToRemoveProps) => {
    const {user} = useAuth()

    const [schedulerValue, setSchedulerValue] = useState<SchedulerValue>({date: "", scheduleId: data ? data[0] : undefined})

    const {data: appointments, isLoading} = useQuery(
        ["get statistic", schedulerValue?.scheduleId],
        () => appointmentsClient.get({
                employeeId: user?.id!,
                scheduleId: schedulerValue?.scheduleId, page: undefined, size: undefined
            }), {
                enabled: !!data && !!schedulerValue?.scheduleId
            }
        )

    if(!data) return

    return <Card>
        <CardBody>
            <Text>При заполнении будут удалены следующие записи: </Text>
            <Scheduler
                value={schedulerValue}
                onChange={setSchedulerValue}
                contentType="COUNT"
                selectedSchedules={data}
            />
            {
                isLoading && <Flex justifyContent={"center"}>
                    <Spinner my={4} />
                </Flex>
            }
            <Flex flexDir={"column"} gap={3} mb={3}>
                {
                    appointments?.list.map(i => <Box bgColor="gray.100" borderRadius={5} px={4} py={2} key={i.id}>
                        {
                            `${i.service?.name}, ${i.startAt} - ${i.endAt}`
                        }
                        <Text>{i.phone}</Text>
                    </Box>)
                }
            </Flex>
            <Text>Продолжить?</Text>
        </CardBody>
    </Card>
}