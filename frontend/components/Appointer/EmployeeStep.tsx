'use client';

import { ColumnType, CustomTable } from "@/components/Table/Table";
import { AppointmentDto, EmployeeDto, ServiceDto, UserDto } from "@/services/client";
import { usersClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { Avatar, Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "react-query";

const SERVER_URL = process.env.SERVER_URL!

const columns: ColumnType[] = [
    {
        title: "Фото",
        name: nameof<EmployeeDto>("file"),
        convertContent: (value) => <Avatar src={`${SERVER_URL}/${value?.path}`} w="30px" h="30px"/>
    },
    {
        title: "Имя",
        name: nameof<EmployeeDto>("fullName")
    },
    {
        title: "Действия",
        name: "_actions"
    }
]

type EmployeeStepProps = {
    goToNext: () => void
    goBack: () => void
}

export default function EmployeeStep({goToNext, goBack}: EmployeeStepProps) {
    const {setValue, watch} = useFormContext()

    const serviceIdChanged = watch(nameof<AppointmentDto>("serviceId"))

    const [page, setPage] = useState<number>(1)
    const {data} = useQuery(
        ["get employees", page, serviceIdChanged],
        () => usersClient.getEmployees({page: page, size: 10}), {
            enabled: !!serviceIdChanged
        }
    )

    if(!serviceIdChanged) {
        return <Flex
            w="100%"
            justifyContent={"center"}
            alignItems="center"
            cursor={"pointer"}
            gap={2}
        >
            <Text
                _hover={{textDecoration: "underline"}} 
                onClick={goBack}
            >
                Сначала выберите мастера
            </Text>
            <FaExternalLinkAlt />
        </Flex>
    }

    return (
        <Container maxW="800px" px={0}>
            <CustomTable
                columns={columns}
                data={data}
                page={page}
                setPage={setPage}
                actions={[
                    {
                        text: "Выбрать",
                        mutate: (value) => {
                            setValue(nameof<AppointmentDto>("employeeId"), value.id)
                            goToNext()
                        }
                    }
                ]}
            />
        </Container>
    );
}
