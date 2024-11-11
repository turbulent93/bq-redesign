'use client';

import { ColumnType, CustomTable } from "@/components/Table/Table";
import { PromoDto, ServiceDto } from "@/services/client";
import { promosClient, servicesClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { useAuth } from "@/utils/useAuth";
import { Button, Container } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
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

    return (
        <Container maxW="800px">
            <Button mb={4}>
                <Link href={"promos/add"}>
                    Добавить промо
                </Link>
            </Button>
            <CustomTable
                columns={columns}
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
