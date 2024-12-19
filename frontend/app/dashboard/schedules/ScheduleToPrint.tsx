import { Avatar, Box, Button, Container, Flex, Image, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { Scheduler } from "@/components/Scheduler/Scheduler";
import { UpdateScheduleForm } from "./UpdateScheduleForm";
import Link from "next/link";
import { MutableRefObject, useEffect, useState } from "react";
import { DashboardNavigation } from "@/components/DashboardNavigation";
import { appointmentRoutes } from "@/components/Sidebar/routes";
import { useAuth } from "@/utils/useAuth";
import { useQuery } from "react-query";
import { uploadClient, usersClient } from "@/services/services";
import { Select } from "chakra-react-select";
import { MASTER_ROLE_NAME } from "@/utils/constants";
import { EmployeeFilter } from "@/components/EmployeeFilter";
import { CustomModal } from "@/components/CustomModal";
import { MdLocalPrintshop } from "react-icons/md";
import { usePDF } from 'react-to-pdf';

type ScheduleToPrintProps = {
    onOpen: () => void
    setScheduleId: (v?: number) => void
    userId?: number
    scheduleId?: number
    close: () => void
    print?: boolean
}

export const ScheduleToPrint = ({onOpen, setScheduleId, scheduleId, userId, close, print}: ScheduleToPrintProps) => {
    const {user} = useAuth()

    const { toPDF, targetRef } = usePDF({filename: 'расписание.pdf'});

    const {data: avatar} = useQuery(["get avatar"], () => uploadClient.download(user?.avatar?.path), {
        enabled: !!user?.avatar,
        select: (res) => {
            // console.log(URL.createObjectURL(data.blob()))
            return URL.createObjectURL(res?.data!)
        }
    })

    useEffect(() => {
            // console.log("print", avatar)
        if(!!avatar && print) {
            toPDF()
            close()
        }
    }, [print])

    return <>
        <Box h={0} w={0} overflow={"hidden"}>
            <Flex
                ref={targetRef}
                flexDir="column"
                w="100%"
                minW="1100px"
                alignItems={"center"}
                justifyContent={"center"}
                h="1550px"
                bgGradient='linear(to-br, white, gray.100)'
            >
                <Box w="900px">
                    <Flex justifyContent={"space-between"} alignItems="center" mb={4}>
                        <Flex alignItems="start" w="100%">
                            <Avatar
                                src={avatar}
                                w="110px"
                                h="110px"
                                mr={4}
                                objectFit={"contain"}
                            />
                            <Box>
                                <Text color={"gray.700"} fontSize={32}>
                                    {user?.fullName}
                                </Text>
                                <Text
                                    fontSize={28}
                                >
                                    {user?.specializations?.map(s => s.name).join(", ")}
                                </Text>
                            </Box>
                        </Flex>
                        <Text fontSize={34} whiteSpace={"nowrap"} textColor={"gray.700"} fontWeight={"bold"}>
                            8 (999) 232 4224
                        </Text>
                    </Flex>
                    <Scheduler
                        userId={user?.role == MASTER_ROLE_NAME ? user.id : userId}
                        contentType="WORK_TIME"
                        value={{date: "", scheduleId}}
                        onChange={(value) => {
                            setScheduleId(value.scheduleId)
                            onOpen()
                        }}
                        print={true}
                    />
                </Box>
                <Flex alignItems={"center"} justifyContent={"center"} mt={10} w="900px">
                    <Text fontSize={20} color={"gray.700"} w="170px" textAlign={"center"}>
                        Можно записаться на сайте
                    </Text>
                    <Box>
                        <Image src="/site_qr.jpg" mr={3} width="200px" height="200px" />
                        <Text fontSize={20} color={"gray.700"} textAlign={"center"}>
                            bg-kurgan.ru
                        </Text>
                    </Box>
                    <Text fontSize={20} color={"gray.700"} w="170px" textAlign={"center"}>
                        или в группе ВК
                    </Text>
                    <Box>
                        <Image src="/site_qr.jpg" mr={3} width="200px" height="200px" />
                        <Text fontSize={20} color={"gray.700"} textAlign={"center"}>
                            @bg-kurgan
                        </Text>
                    </Box>
                </Flex>
            </Flex>
        </Box>
        {/* <Button
            onClick={() => {
                toPDF()
                close()
            }}
            mt={1}
        >
            Скачать
        </Button> */}
    </>
}