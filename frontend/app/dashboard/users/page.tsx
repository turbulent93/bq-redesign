'use client';

import { ColumnType, CustomTable } from "@/components/Table/Table";
import { ServiceDto, UserDto } from "@/services/client";
import { usersClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { Avatar, Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {ADMIN_ROLE_NAME} from "@/utils/constants"

const SERVER_URL = process.env.SERVER_URL!

const columns: ColumnType[] = [
    {
        title: "Фото",
        name: nameof<UserDto>("employee"),
        convertContent: (value) => <Avatar src={`${SERVER_URL}/${value?.file?.path}`} w="30px" h="30px"/>
    },
    {
        title: "Логин",
        name: nameof<UserDto>("login")
    },
    {
        title: "Роль",
        name: nameof<UserDto>("role"),
        convertContent: (value) => <Box
            bgColor={value == ADMIN_ROLE_NAME ? "red.100" : "blue.100"}
            borderRadius={"4px"}
            px={2}
            py={1}
            textColor={value == ADMIN_ROLE_NAME ? "red.400" : "blue.400"}
            fontWeight={"bold"}
            fontSize={12}
            w="100px"
            textAlign={"center"}
        >{value}</Box>
    },
    {
        title: "Имя",
        name: nameof<UserDto>("employee"),
        convertContent: (value) => value?.fullName
    },
    {
        title: "Специализации",
        name: nameof<UserDto>("employee"),
        convertContent: (value) => <Flex gap={2} maxW={"200px"} flexWrap={"wrap"}>
            {
                value?.specializations.map((i: ServiceDto) => <Text
                    bgColor={"gray.100"}
                    borderRadius={"4px"}
                    px={2}
                    py={1}
                    textColor={"gray.500"}
                    fontWeight={"bold"}
                    fontSize={12}
                    textAlign={"center"}
                    key={i.id}
                    whiteSpace={"nowrap"}
                    overflow={"hidden"}
                    textOverflow={"ellipsis"}
                    maxW={"200px"}
                >{i.name}</Text>)
            }
        </Flex>
    },
    {
        title: "Действия",
        name: "_actions",
        removeDisabled: (value) => value.login == "admin",
        updateDisabled: (value) => value.login == "admin"
    }
]

export default function ServicesPage() {
    const [page, setPage] = useState<number>(1)
    const {data} = useQuery(
        ["get users", page],
        () => usersClient.get({page: page, size: 10})
    )

    const queryClient = useQueryClient()

    const {mutate} = useMutation((id: number) => usersClient.remove(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["get users", page])
        }
    })

    return (
        <Container maxW="800px">
            <Button mb={4}>
                <Link href={"users/add"}>
                    Добавить пользователя
                </Link>
            </Button>
            <CustomTable
                columns={columns}
                data={data}
                updatePath="users/update"
                removeMutate={mutate}
                page={page}
                setPage={setPage}
            />
        </Container>
    );
}
