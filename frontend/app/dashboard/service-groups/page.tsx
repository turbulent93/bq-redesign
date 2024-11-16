'use client';

import { DashboardHeader } from "@/components/DashboardHeader";
import { ColumnType, CustomTable } from "@/components/Table/Table";
import { ServiceDto, ServiceGroupDto } from "@/services/client";
import { serviceGroupClient, servicesClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { useAuth } from "@/utils/useAuth";
import { Button, Container, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { DashboardNavigation } from "../../../components/DashboardNavigation";
import { serviceRoutes } from "@/components/Sidebar/routes";

const columns: ColumnType[] = [
    {
        title: "Название",
        name: nameof<ServiceGroupDto>("name")
    },
    {
        title: "Действия",
        name: "_actions"
    }
]

export default function Page() {
    const [page, setPage] = useState<number>(1)
    const {data} = useQuery(
        ["get service-groups", page],
        () => serviceGroupClient.get({page: page, size: 10})
    )

    const queryClient = useQueryClient()

    const {mutate} = useMutation((id: number) => serviceGroupClient.remove(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["get service-groups", page])
        }
    })

    return <Container maxW="800px">
        <DashboardNavigation routes={serviceRoutes}/>
        <Button mb={4} leftIcon={<CiCirclePlus size={24}/>}>
            <Link href={"service-groups/add"}>
                Добавить
            </Link>
        </Button>
        <CustomTable
            columns={columns}
            data={data}
            updatePath="service-groups/update"
            removeMutate={mutate}
            page={page}
            setPage={setPage}
        />
    </Container>
}
