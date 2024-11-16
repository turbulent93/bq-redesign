'use client';

import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardNavigation } from "@/components/DashboardNavigation";
import { promoRoutes, serviceRoutes } from "@/components/Sidebar/routes";
import { ColumnType, CustomTable } from "@/components/Table/Table";
import { PromoDto, ServiceDto } from "@/services/client";
import { promosClient, servicesClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { useAuth } from "@/utils/useAuth";
import { Button, Container, Flex, Switch, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "react-query";

const columns: ColumnType[] = [
    {
        title: "Название",
        name: nameof<PromoDto>("title")
    },
    {
        title: "Описание",
        name: nameof<PromoDto>("description")
    },
    {
        title: "Дата начала",
        name: nameof<PromoDto>("startDate")
    },
    {
        title: "Дата окончания",
        name: nameof<PromoDto>("endDate")
    },
    {
        title: "Действия",
        name: "_actions"
    }
]

const abbreviatedColumns: ColumnType[] = [
    {
        title: "Название",
        name: nameof<PromoDto>("title")
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
        ["get promos", page],
        () => promosClient.get({page: page, size: 10})
    )

    const queryClient = useQueryClient()

    const {mutate} = useMutation((id: number) => servicesClient.remove(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["get promos", page])
        }
    })

    const [abbreviatedTable, setAbbreviatedTable] = useState(false)

    return (
        <Container maxW="800px">
            <DashboardNavigation routes={promoRoutes}/>
            <DashboardHeader
                addUrl="promos/add"
                abbreviatedTable={abbreviatedTable}
                setAbbreviatedTable={setAbbreviatedTable}
            />
            <CustomTable
                columns={abbreviatedTable ? abbreviatedColumns : columns}
                data={data}
                updatePath="promos/update"
                removeMutate={mutate}
                page={page}
                setPage={setPage}
                // actionsDisabled={actionsDisabled}
            />
        </Container>
    );
}
