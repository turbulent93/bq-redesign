"use client"

import { Box, Button, Container, Flex, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { Scheduler } from "@/components/Scheduler/Scheduler";
import { UpdateScheduleForm } from "./UpdateScheduleForm";
import Link from "next/link";
import { useState } from "react";
import { DashboardNavigation } from "@/components/DashboardNavigation";
import { appointmentRoutes } from "@/components/Sidebar/routes";
import { useAuth } from "@/utils/useAuth";
import { useQuery } from "react-query";
import { usersClient } from "@/services/services";
import { Select } from "chakra-react-select";
import { MASTER_ROLE_NAME } from "@/utils/constants";
import { EmployeeFilter } from "@/components/EmployeeFilter";
import { CustomModal } from "@/components/CustomModal";

export default function ServicesPage() {
    const [scheduleId, setScheduleId] = useState<number>()

    const {isOpen, onOpen, onClose} = useDisclosure()

    const {user} = useAuth()

    const [userId, setUserId] = useState<number | undefined>()

    return <Container maxW="600px">
        <DashboardNavigation routes={appointmentRoutes}/>
        <EmployeeFilter
            userId={userId}
            setUserId={setUserId}
        />
        <Button >
            <Link href={"schedules/fill"}>
                Заполнить расписание
            </Link>
        </Button>
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