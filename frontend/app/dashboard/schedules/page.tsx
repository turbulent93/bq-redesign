"use client"

import { Button, Container, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { Scheduler } from "@/components/Scheduler/Scheduler";
import { UpdateScheduleForm } from "./UpdateScheduleForm";
import Link from "next/link";
import { useState } from "react";

export default function ServicesPage() {
    const [scheduleId, setScheduleId] = useState<number>()

    const {isOpen, onOpen, onClose} = useDisclosure()

    // useEffect(() => {
    //     if(scheduleId) {
    //         onOpen()
    //     }
    // }, [scheduleId])

    return <Container maxW="600px">
        <Button mb={4}>
            <Link href={"schedules/fill"}>
                Заполнить расписание
            </Link>
        </Button>
        <Scheduler
            contentType="WORK_TIME"
            value={{date: "", scheduleId}}
            onChange={(value) => {
                setScheduleId(value.scheduleId)
                onOpen()
            }}
        />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay
                bg='blackAlpha.300'
                backdropFilter='blur(10px) hue-rotate(90deg)'
            />
            <ModalContent mx={4}>
                <ModalCloseButton />
                <UpdateScheduleForm scheduleId={scheduleId} onClose={onClose}/>
            </ModalContent>
        </Modal>
    </Container>
}