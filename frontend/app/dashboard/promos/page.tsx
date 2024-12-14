'use client';

import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardNavigation } from "@/components/DashboardNavigation";
import { promoRoutes, serviceRoutes } from "@/components/Sidebar/routes";
import { ColumnType, CustomTable } from "@/components/Table/Table";
import { PromoDto, ServiceDto } from "@/services/client";
import { promosClient, servicesClient } from "@/services/services";
import { PROMO_TYPE_BONUS, PROMO_TYPE_DISCOUNT, PROMO_TYPE_INVITE } from "@/utils/constants";
import { nameof } from "@/utils/nameof";
import { useAuth } from "@/utils/useAuth";
import { Box, Button, Container, Flex, Switch, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { BsEye } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FiUserPlus } from "react-icons/fi";

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
        title: "Тип",
        name: nameof<PromoDto>("type"),
        convertContent: (v) => {
            if(v == PROMO_TYPE_BONUS) {
                return <Box
                    borderRadius={"md"}
                    bgColor="red.300"
                    color="white"
                    // px={2}
                    p={1}
                    textAlign={"center"}
                    fontSize={18}
                    shadow={"md"}
                >
                    ₽
                </Box>
            } else if(v == PROMO_TYPE_DISCOUNT) {
                return <Box
                    borderRadius={"md"}
                    bgColor="blue.300"
                    color="white"
                    // px={2}
                    p={1}
                    textAlign={"center"}
                    fontSize={18}
                    shadow={"md"}
                >
                    %
                </Box>
            } else if(v == PROMO_TYPE_INVITE) {
                return <Box
                    borderRadius={"md"}
                    bgColor="green.300"
                    color="white"
                    // px={2}
                    p={1}
                    textAlign={"center"}
                    fontSize={18}
                    shadow={"md"}
                >
                    <FiUserPlus />
                </Box>
            }
        }
    },
    {
        title: "",
        name: nameof<PromoDto>("showOnHomePage"),
        convertContent: (v) => v ? <Box color="gray.700"><PiEye /></Box> : <Box color="gray.700"><PiEyeClosed /></Box>
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
        title: "Тип",
        name: nameof<PromoDto>("type"),
        convertContent: (v) => {
            if(v == PROMO_TYPE_BONUS) {
                return <Flex
                    borderRadius={"md"}
                    bgColor="red.300"
                    color="white"
                    // px={2}
                    p={1}
                    textAlign={"center"}
                    fontSize={18}
                    shadow={"md"}
                    w="35px"
                    h="35px"
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    {/* <Box m="auto"> */}
                        ₽
                    {/* </Box> */}
                </Flex>
            } else if(v == PROMO_TYPE_DISCOUNT) {
                return <Flex
                    borderRadius={"md"}
                    bgColor="blue.300"
                    color="white"
                    // px={2}
                    p={"auto"}
                    textAlign={"center"}
                    fontSize={18}
                    shadow={"md"}
                    w="35px"
                    h="35px"
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <Box m="auto">
                        %
                    </Box>
                </Flex>
            } else if(v == PROMO_TYPE_INVITE) {
                return <Flex
                    borderRadius={"md"}
                    bgColor="green.300"
                    color="white"
                    // px={1}
                    // p={1}
                    fontSize={18}
                    shadow={"md"}
                    // w="100%"
                    w="35px"
                    h="35px"
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <Box>
                        <FiUserPlus size={20} />
                    </Box>
                    {/* + */}
                </Flex>
            }
        }
    },
    {
        title: "",
        name: nameof<PromoDto>("showOnHomePage"),
        convertContent: (v) => v ? <Box color="gray.700"><PiEye /></Box> : <Box color="gray.700"><PiEyeClosed /></Box>
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
                scroll={!abbreviatedTable}
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
