'use client';

import { ColumnType, CustomTable } from "@/components/Table/Table";
import { ServiceDto, SpecializationDto, UserDto } from "@/services/client";
import { usersClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { Avatar, Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {ADMIN_ROLE_NAME, CLIENT_ROLE_NAME, ROLE_NAMES} from "@/utils/constants"
import { DashboardHeader } from "@/components/DashboardHeader";
import { useAuth } from "@/utils/useAuth";
import { DashboardNavigation } from "@/components/DashboardNavigation";
import { serviceRoutes, userRoutes } from "@/components/Sidebar/routes";
import { Filter, FilterItem } from "@/components/Filter";

const SERVER_URL = process.env.SERVER_URL!

const columns: ColumnType[] = [
    {
        title: "",
        name: nameof<UserDto>("avatar"),
        convertContent: (value) => <Avatar 
            src={!!value?.path ? `${SERVER_URL}/${value?.path}` : undefined}
            w="30px"
            h="30px"
        />,
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
        title: "Фио",
        name: nameof<UserDto>("fullName")
    },
    {
        title: "Специализации",
        name: nameof<UserDto>("specializations"),
        convertContent: (value) => <Flex flexDir={"column"}>{
            value.map((i: SpecializationDto, index: number) => <Text
                key={index}
            >
                {
                    index == value.length - 1
                        ? i.name
                        : i.name + ","
                }
            </Text>)
        }</Flex>
    },
    {
        title: "Действия",
        name: "_actions",
        removeDisabled: (value) => value.login == "admin",
        updateDisabled: (value) => value.login == "admin"
    }
]

const abbreviatedColumns: ColumnType[] = [
    {
        title: "",
        name: nameof<UserDto>("avatar"),
        convertContent: (value) => <Avatar 
            src={!!value?.path ? `${SERVER_URL}/${value?.path}` : undefined}
            w="30px"
            h="30px"
        />,
    },
    {
        title: "Логин",
        name: nameof<UserDto>("login")
    },
    {
        title: "Действия",
        name: "_actions",
        removeDisabled: (value) => value.login == "admin",
        updateDisabled: (value) => value.login == "admin"
    }
]

export default function ServicesPage() {
    const {isAdmin} = useAuth()
    
    const [abbreviatedTable, setAbbreviatedTable] = useState(false)
    const roleItems = ROLE_NAMES.map(i => ({value: i, label: i}))
    const [role, setRole] = useState<FilterItem>()
    
    const [page, setPage] = useState<number>(1)
    const {data} = useQuery(
        ["get users", page, role?.value],
        () => usersClient.get({page: page, size: 10, role: isAdmin ? role?.value : CLIENT_ROLE_NAME})
    )

    const queryClient = useQueryClient()

    const {mutate} = useMutation((id: number) => usersClient.remove(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["get users", page])
        }
    })

    return (
        <Container maxW="800px">
            <DashboardHeader
                addUrl="users/add"
                abbreviatedTable={abbreviatedTable}
                setAbbreviatedTable={setAbbreviatedTable}
            />
            {
                isAdmin && <Filter
                    items={roleItems}
                    value={role}
                    setValue={setRole}
                />
            }
            <CustomTable
                columns={abbreviatedTable ? abbreviatedColumns : columns}
                data={data}
                updatePath="users/update"
                removeMutate={mutate}
                page={page}
                setPage={setPage}
            />
        </Container>
    );
}
