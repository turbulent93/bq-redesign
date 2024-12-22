'use client';

import { ColumnType, CustomTable } from "@/components/Table/Table";
import { AppointmentDto, ScheduleDto, ServiceDto, UserDto } from "@/services/client";
import { appointmentsClient, schedulesClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { Box, Button, Container, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AppointmentsActivity } from "./AppointmentsActivity";
import { DateInput } from "@/components/DateInput";
import { Scheduler, SchedulerValue } from "@/components/Scheduler/Scheduler";
import { useAuth } from "@/utils/useAuth";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardNavigation } from "@/components/DashboardNavigation";
import { appointmentRoutes, serviceRoutes } from "@/components/Sidebar/routes";
import { EmployeeFilter } from "@/components/EmployeeFilter";
import { MASTER_ROLE_NAME } from "@/utils/constants";

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

const abbreviatedColumns: ColumnType[] = [
    {
        title: "Услуга",
        name: nameof<AppointmentDto>("service"),
        convertContent: (value: ServiceDto) => value.name
    },
    {
        title: "Время",
        name: nameof<AppointmentDto>("startAt")
    },
    {
        title: "Действия",
        name: "_actions"
    }
]


export default function Page() {
    const {user, isAdmin} = useAuth()
    const [userId, setUserId] = useState<number | undefined>()
    const [schedulerValue, setSchedulerValue] = useState<SchedulerValue>()

    // const {} = useQuery(
    //     ["get nearest schedule", user?.role == MASTER_ROLE_NAME ? !!user?.id : !!userId],
    //     () => schedulesClient.nearest({employeeId: user?.role == MASTER_ROLE_NAME ? user?.id! : userId!}), {
    //         enabled: user?.role == MASTER_ROLE_NAME ? !!user?.id : !!userId,
    //         onSuccess: (data) => setSchedulerValue(data ? {date: data.date, scheduleId: data.id} : undefined)
    //     }
    // )

    const [tab, setTab] = useState<number>()

    const [page, setPage] = useState<number>(1)
    const {data} = useQuery(
        ["get appointments", page, schedulerValue?.scheduleId, tab, userId],
        () => appointmentsClient.get({
            ...(tab == 1 ? {
                page: page,
                size: 5,
            } : {}),
            employeeId: user?.role == MASTER_ROLE_NAME ? user?.id! : userId!,
            scheduleId: schedulerValue?.scheduleId
        }), {
            enabled: !!schedulerValue?.scheduleId && (user?.role == MASTER_ROLE_NAME ? !!user?.id : !!userId)
        }
    )

    const queryClient = useQueryClient()

    const {mutate} = useMutation((id: number) => appointmentsClient.remove(id), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: "get appointments"})
        }
    })

    // const actionsDisabled = (value: AppointmentDto) => {
    //     return !isAdmin
    //         ? value.createdBy != user?.id
    //         : false
    // }
    
    const [abbreviatedTable, setAbbreviatedTable] = useState(false)

    return (
        <Container maxW="800px">
            <DashboardNavigation routes={appointmentRoutes}/>
            <DashboardHeader
                addUrl="appointments/add"
                abbreviatedTable={abbreviatedTable}
                setAbbreviatedTable={setAbbreviatedTable}
            />
            <EmployeeFilter
                userId={userId}
                setUserId={setUserId}
            />
            <Scheduler
                userId={user?.role == MASTER_ROLE_NAME ? user.id : userId}
                value={schedulerValue}
                onChange={setSchedulerValue}
                contentType="COUNT"
                collapsed
                isDatePick
            />
            <Tabs tabIndex={tab} onChange={setTab}>
                <TabList>
                    <Tab>Календарь</Tab>
                    <Tab>Таблица</Tab>
                </TabList>
                <TabPanels>
                <TabPanel px={0}>
                    <AppointmentsActivity data={data?.list} collapsed={abbreviatedTable}/>
                </TabPanel>
                <TabPanel>
                    <CustomTable
                        columns={abbreviatedTable ? abbreviatedColumns : columns}
                        scroll={!abbreviatedTable}
                        data={data}
                        updatePath="appointments/update"
                        removeMutate={mutate}
                        page={page}
                        setPage={setPage}
                        // actionsDisabled={actionsDisabled}
                    />
                </TabPanel>
            </TabPanels>
            </Tabs>
        </Container>
    );
}
