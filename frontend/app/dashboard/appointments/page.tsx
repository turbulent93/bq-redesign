'use client';

import { ColumnType, CustomTable } from "@/components/Table/Table";
import { AppointmentDto, EmployeeDto, ScheduleDto, ServiceDto, UserDto } from "@/services/client";
import { appointmentsClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { Box, Button, Container, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AppointmentsActivity } from "./AppointmentsActivity";
import { DateInput } from "@/components/DateInput";
import { SchedulerValue } from "@/components/Scheduler/Scheduler";
import { useAuth } from "@/utils/useAuth";

const columns: ColumnType[] = [
    {
        title: "Услуга",
        name: nameof<AppointmentDto>("service"),
        convertContent: (value: ServiceDto) => value.name
    },
    {
        title: "Время начала",
        name: nameof<AppointmentDto>("startAt")
    },
    {
        title: "Время окончания",
        name: nameof<AppointmentDto>("endAt")
    },
    {
        title: "Дата",
        name: nameof<AppointmentDto>("schedule"),
        convertContent: (value: ScheduleDto) => value.date
    },
    {
        title: "Клиент",
        name: nameof<AppointmentDto>("phone")
    },
    {
        title: "Действия",
        name: "_actions"
    }
]

export default function Page() {
    const {user, isAdmin} = useAuth()

    const [schedulerValue, setSchedulerValue] = useState<SchedulerValue>()
    const [tab, setTab] = useState<number>()

    const [page, setPage] = useState<number>(1)
    const {data} = useQuery(
        ["get appointments", page, schedulerValue?.scheduleId, tab],
        () => appointmentsClient.get({
            ...(tab == 1 ? {
                page: page,
                size: 5,
            } : {}),
            employeeId: user?.employee?.id!,
            scheduleId: schedulerValue?.scheduleId
        }), {
            enabled: !!schedulerValue?.scheduleId
        }
    )

    const queryClient = useQueryClient()

    const {mutate} = useMutation((id: number) => appointmentsClient.remove(id), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: "get appointments"})
        }
    })

    const actionsDisabled = (value: AppointmentDto) => {
        return !isAdmin
            ? value.createdBy != user?.employee?.id
            : true
    }

    return (
        <Container maxW="800px">
            <Flex gap={3} flexWrap={"wrap"} mb={4}>
                <Button>
                    <Link href={"appointments/add"}>
                        Добавить запись
                    </Link>
                </Button>
                <DateInput value={schedulerValue} onChange={setSchedulerValue}/>
            </Flex>
            <Tabs tabIndex={tab} onChange={setTab}>
                <TabList>
                    <Tab>Календарь</Tab>
                    <Tab>Таблица</Tab>
                </TabList>
                <TabPanels>
                <TabPanel overflowX={"scroll"} px={0}>
                    <AppointmentsActivity data={data?.list} />
                </TabPanel>
                <TabPanel>
                    <CustomTable
                        columns={columns}
                        data={data}
                        updatePath="appointments/update"
                        removeMutate={mutate}
                        page={page}
                        setPage={setPage}
                        actionsDisabled={actionsDisabled}
                    />
                </TabPanel>
            </TabPanels>
            </Tabs>
        </Container>
    );
}
