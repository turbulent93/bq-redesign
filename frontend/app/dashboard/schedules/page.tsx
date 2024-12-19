"use client"

import { Avatar, Box, Button, Container, Flex, Image, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { Scheduler } from "@/components/Scheduler/Scheduler";
import { UpdateScheduleForm } from "./UpdateScheduleForm";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { ScheduleToPrint } from "./ScheduleToPrint";

const SERVER_URL = process.env.SERVER_URL!

export default function ServicesPage() {
    const [scheduleId, setScheduleId] = useState<number>()

    const {isOpen, onOpen, onClose} = useDisclosure()

    const {user} = useAuth()

    const [userId, setUserId] = useState<number | undefined>()

    const [print, setPrint] = useState(false)

    return <Container maxW="1100px">
        <DashboardNavigation routes={appointmentRoutes}/>
        <EmployeeFilter
            userId={userId}
            setUserId={setUserId}
        />
        <Flex justifyContent={"space-between"} mb={4}>
            <Button>
                <Link href={"schedules/fill"}>
                    Заполнить расписание
                </Link>
            </Button>
            <Button
                onClick={() => {
                    setPrint(true)
                }}
            >
                <MdLocalPrintshop />
            </Button>
        </Flex>
        <ScheduleToPrint
            userId={userId}
            onOpen={onOpen}
            setScheduleId={setScheduleId}
            scheduleId={scheduleId}
            close={() => setPrint(false)}
            print={print}
        />
        <Scheduler
            userId={user?.role == MASTER_ROLE_NAME ? user.id : userId}
            contentType="WORK_TIME"
            value={{date: "", scheduleId}}
            onChange={(value) => {
                setScheduleId(value.scheduleId)
                onOpen()
            }}
        />
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalCloseButton />
            <UpdateScheduleForm scheduleId={scheduleId} onClose={onClose}/>
        </CustomModal>
    </Container>
}