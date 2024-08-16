'use client';

import { ColumnType, CustomTable } from "@/components/Table/Table";
import { SpecializationDto } from "@/services/client";
import { specializationsClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { useAuth } from "@/utils/useAuth";
import { Button, Container } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const columns: ColumnType[] = [
    {
        title: "Название",
        name: nameof<SpecializationDto>("name")
    },
    {
        title: "Действия",
        name: "_actions"
    }
]

export default function ServicesPage() {
    const {user, isAdmin} = useAuth()

    const [page, setPage] = useState<number>(1)
    const {data} = useQuery(
        ["get specializations", page],
        () => specializationsClient.get({page: page, size: 10})
    )

    const queryClient = useQueryClient()

    const {mutate} = useMutation((id: number) => specializationsClient.remove(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["get specializations", page])
        }
    })

    // const actionsDisabled = (value: SpecializationDto) => {
    //     return !isAdmin
    //         ? value.createdBy != user?.id
    //         : true
    // }

    return (
        <Container maxW="800px">
            <Button mb={4}>
                <Link href={"specializations/add"}>
                    Добавить специализацию
                </Link>
            </Button>
            <CustomTable
                columns={columns}
                data={data}
                updatePath="specializations/update"
                removeMutate={mutate}
                page={page}
                setPage={setPage}
                // actionsDisabled={actionsDisabled}
            />
        </Container>
    );
}
