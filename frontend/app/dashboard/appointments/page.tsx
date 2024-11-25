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
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardNavigation } from "@/components/DashboardNavigation";
import { appointmentRoutes, serviceRoutes } from "@/components/Sidebar/routes";

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
            ? value.createdBy != user?.id
            : false
    }
    
    const [abbreviatedTable, setAbbreviatedTable] = useState(false)

    return (
        <Container maxW="800px">
            <DashboardNavigation routes={appointmentRoutes}/>
            <DashboardHeader
                addUrl="appointments/add"
                abbreviatedTable={abbreviatedTable}
                setAbbreviatedTable={setAbbreviatedTable}
            />
            <DateInput value={schedulerValue} onChange={setSchedulerValue}/>
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
                        columns={abbreviatedTable ? abbreviatedColumns : columns}
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
