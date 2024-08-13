'use client';

import { ColumnType, CustomTable } from "@/components/Table/Table";
import { ServiceDto } from "@/services/client";
import { servicesClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { useAuth } from "@/utils/useAuth";
import { Button, Container } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

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

    const actionsDisabled = (value: ServiceDto) => {
        return !isAdmin
            ? value.createdBy != user?.employee?.id
            : true
    }

    return (
        <Container maxW="800px">
            <Button mb={4}>
                <Link href={"services/add"}>
                    Добавить услугу
                </Link>
            </Button>
            <CustomTable
                columns={columns}
                data={data}
                updatePath="services/update"
                removeMutate={mutate}
                page={page}
                setPage={setPage}
                actionsDisabled={actionsDisabled}
            />
        </Container>
    );
}
