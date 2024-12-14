'use client';

import { DashboardHeader } from "@/components/DashboardHeader";
import { ColumnType, CustomTable } from "@/components/Table/Table";
import { ServiceDto } from "@/services/client";
import { servicesClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { useAuth } from "@/utils/useAuth";
import { Button, Container, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { DashboardNavigation } from "../../../components/DashboardNavigation";
import { serviceRoutes } from "@/components/Sidebar/routes";

const columns: ColumnType[] = [
    {
        title: "Название",
        name: nameof<ServiceDto>("name")
    },
    {
        title: "Цена",
        name: nameof<ServiceDto>("price"),
        convertContent: (value) => `${value} ₽`
    },
    {
        title: "Длительность",
        name: nameof<ServiceDto>("duration"),
        convertContent: (value) => {
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
    },
    {
        title: "Специализация",
        name: nameof<ServiceDto>("specialization"),
        convertContent: (value) => value.name
    },
    {
        title: "Действия",
        name: "_actions"
    }
]

const abbreviatedColumns: ColumnType[] = [
    {
        title: "Название",
        name: nameof<ServiceDto>("name")
    },
    {
        title: "Действия",
        name: "_actions"
    }
]

export default function ServicesPage() {
    const {user, isAdmin} = useAuth()

    const [page, setPage] = useState<number>(1)
    const {data, isLoading} = useQuery(
        ["get services", page],
        () => servicesClient.get({page: page, size: 10})
    )

    const queryClient = useQueryClient()

    const {mutate} = useMutation((id: number) => servicesClient.remove(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["get services", page])
        }
    })

    // const actionsDisabled = (value: ServiceDto) => {
    //     console.log(isAdmin)
    //     return true
    // }
    const [abbreviatedTable, setAbbreviatedTable] = useState(false)

    return (
        <Container maxW="800px">
            <DashboardNavigation routes={serviceRoutes}/>
            <DashboardHeader
                addUrl="services/add"
                abbreviatedTable={abbreviatedTable}
                setAbbreviatedTable={setAbbreviatedTable}
            />
            <CustomTable
                columns={abbreviatedTable ? abbreviatedColumns : columns}
                scroll={!abbreviatedTable}
                data={data}
                updatePath="services/update"
                removeMutate={mutate}
                page={page}
                setPage={setPage}
                // actionsDisabled={actionsDisabled}
            />
        </Container>
    );
}
