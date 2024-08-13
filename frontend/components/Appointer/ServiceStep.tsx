'use client';

import { ColumnType, CustomTable } from "@/components/Table/Table";
import { AppointmentDto, ServiceDto } from "@/services/client";
import { servicesClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { Button, Container, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaExternalLinkAlt } from "react-icons/fa";
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
        title: "Действия",
        name: "_actions"
    }
]

type ServiceStepProps = {
    goToNext: () => void
    setDuration: (value: number) => void
}

export default function ServiceStep({goToNext, setDuration}: ServiceStepProps) {
    const {setValue} = useFormContext()

    const [page, setPage] = useState<number>(1)
    const {data} = useQuery(
        ["get services", page],
        () => servicesClient.get({page: page, size: 10})
    )

    return (
        <Container maxW="800px">
            <CustomTable
                columns={columns}
                data={data}
                page={page}
                setPage={setPage}
                actions={[
                    {
                        text: "Выбрать",
                        mutate: (value) => {
                            setValue(nameof<AppointmentDto>("serviceId"), value.id)
                            setDuration(value.duration)
                            goToNext()
                        }
                    }
                ]}
            />
        </Container>
    );
}
