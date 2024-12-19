"use client"

import { useAuth } from "@/utils/useAuth"
import { Avatar, Box, Button, Flex, Image, Switch, Text } from "@chakra-ui/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BsPencilFill } from "react-icons/bs"
import { IoExitOutline } from "react-icons/io5"
import { Form } from "../users/Form"
import { AiOutlineUser } from "react-icons/ai"
import { ADMIN_ROLE_NAME } from "@/utils/constants"
import { FaTelegramPlane } from "react-icons/fa"
import { useMutation, useQueryClient } from "react-query"
import { UserDto } from "@/services/client"
import { usersClient } from "@/services/services"
import { MasterForm } from "../users/MasterForm"

const SERVER_URL = process.env.SERVER_URL!

export default function ServicesPage() {
    const {user, logout} = useAuth()
    const [isUpdate, setIsUpdate] = useState(false)
    const queryClient = useQueryClient()
    const [notificationsEnabled, setNotificationsEnabled] = useState(false)

    const {mutate} = useMutation((item: UserDto) => usersClient.update(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get users"})
			queryClient.invalidateQueries({queryKey: "check"})
        }
	})

    useEffect(() => {
        if(user)
            setNotificationsEnabled(!!user?.notificationsEnabled && !!user?.tgChatId)
    }, [user])

    // useEffect(() => {
    //     if(notificationsEnabled != user?.notificationsEnabled && user?.notificationsEnabled != undefined) {
    //         if(notificationsEnabled && !user?.tgChatId) {
    //             window.open(`https://telegram.me/bq_kg_bot?start=${user?.authTgCode}`)
    //         }

    //         mutate({
    //             ...user
    //         } as UserDto)
    //     }
    // }, [notificationsEnabled])

    const handler = (checked: boolean) => {
        if(checked != user?.notificationsEnabled) {
            if(checked && !user?.tgChatId) {
                window.open(`https://telegram.me/bq_kg_bot?start=${user?.authTgCode}`)
            }

            mutate({
                ...user,
                invitePromo: undefined
            } as UserDto)
        }
    }

    return <Flex
        flexDir={"column"}
        alignItems={"center"}
        borderRadius={"md"}
        py={3}
        bgColor={!isUpdate ? "gray.700" : undefined}
        color={!isUpdate ? "white" : undefined}
        my={4}
        mx={!isUpdate ? 10 : undefined}
        position={"relative"}
    >
        <Box
            position={"absolute"}
            textColor={"gray.600"}
            top={3}
            right={4}
            cursor={"pointer"}
            onClick={() => setIsUpdate(!isUpdate)}
        >
            {
                isUpdate
                    ? <Box
                        bgColor={"gray.100"} 
                        p={3}
                        borderRadius={5}
                    ><AiOutlineUser/></Box>
                    : <Box
                        color={"white"}
                        p={3}
                    ><BsPencilFill/></Box>
            }
        </Box>
        {
            isUpdate
                ? <MasterForm
                    mutate={mutate}
                    values={{
                        ...user!,
                        specializationIds: user?.specializations?.map(i => i.id!)!,
                        startWorkTime: user?.startWorkTime ? user.startWorkTime : "9:00",
                        endWorkTime: user?.endWorkTime ? user.endWorkTime : "18:00",
                        invitePromo: undefined
                    }}
                />
                : <>
                    <Avatar
                        src={!!user?.avatar?.path ? `${SERVER_URL}/${user?.avatar?.path}` : undefined}
                        w={"160px"}
                        h={"160px"}
                        // objectFit={'cover'}
                        // borderRadius={"100%"}
                        mb={4}
                    />
                    <Text fontSize={20} fontWeight={"bold"} mb={1}>
                        {
                            user?.fullName
                        }
                    </Text>
                    {/* <Flex gap={4}>
                        <Text>{user?.login}</Text>
                        <Box
                            bgColor={user?.role == ADMIN_ROLE_NAME ? "red.100" : "blue.100"}
                            borderRadius={"4px"}
                            px={2}
                            py={1}
                            textColor={user?.role == ADMIN_ROLE_NAME ? "red.400" : "blue.400"}
                            fontWeight={"bold"}
                            fontSize={12}
                            w="100px"
                            textAlign={"center"}
                        >{user?.role}</Box>
                    </Flex> */}
                    <Text mb={3}>
                        {
                            user?.specializations?.map(i => i.name).join(", ")
                        }
                    </Text>
                    <Flex
                        gap={4}
                        borderRadius={5}
                        // bgColor={"blue.300"}
                        px={4}
                        py={2}
                        // textColor={"white"}
                        // textColor={"gray.600"}
                        alignItems={"center"}
                        mb={4}
                    >
                        <Switch
                            isChecked={notificationsEnabled}
                            onChange={(e) => handler(e.target.checked)}
                        />
                        <Text>
                            Уведомления
                        </Text>
                        <FaTelegramPlane size={20}/>
                    </Flex>
                    <Button
                        bgColor={"red.300"}
                        color="white"
                        // gap={4}
                        // alignItems={"center"}
                        // mt={4}
                        // cursor={"pointer"}
                        onClick={logout}
                        leftIcon={<IoExitOutline/>}
                    >
                        {/* <IoExitOutline/> */}
                        <Text>
                            Выйти
                        </Text>
                    </Button>
                </>
        }
    </Flex>
}