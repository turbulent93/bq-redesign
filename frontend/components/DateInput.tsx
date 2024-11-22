import { Input, InputGroup, InputRightElement, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { CustomInput } from "./CustomInput"
import { AiOutlineSchedule } from "react-icons/ai"
import { UpdateScheduleForm } from "@/app/dashboard/schedules/UpdateScheduleForm"
import { Scheduler, SchedulerValue } from "./Scheduler/Scheduler"
import { useState } from "react"
import { useSchedulesQuery } from "./Scheduler/useSchedulesQuery"
import moment from "moment"
import { useAuth } from "@/utils/useAuth"
import { DATE_FORMAT } from "@/utils/constants"

type DateInputProps = {
    value?: SchedulerValue
    onChange: (value?: SchedulerValue) => void
    label?: string
    disabled?: boolean
}

export const DateInput = ({value, onChange, label, disabled}: DateInputProps) => {
    const {isOpen, onOpen, onClose} = useDisclosure()

    const {user} = useAuth()
    const curDate = moment()

    useSchedulesQuery({
        month: curDate.month() + 1,
        year: curDate.year(),
        employeeId: user?.employee?.id,
        onSuccess: (data) => {
            const first = data.find(i => i.scheduleId && i.day >= curDate.date())

            if(first) {
                onChange({
                    scheduleId: first.scheduleId,
                    date: moment({
                        year: curDate.year(),
                        month: curDate.month(),
                        day: first.day
                    }).format(DATE_FORMAT)
                })
            }
        }
    })

    return <>
        {
            label && <Text mb='8px'>{label}</Text>
        }
        <InputGroup mb={label ? 1 : undefined}>
            <Input
                placeholder='Дата не выбрана'
                value={value?.date || ""}
                onChange={(e) => onChange({...value, date: e.target.value})}
                disabled={disabled}
            />
            <InputRightElement onClick={!disabled ? onOpen : undefined} textColor={"gray.600"}>
                <AiOutlineSchedule />
            </InputRightElement>
        </InputGroup>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay
                bg='blackAlpha.300'
                backdropFilter='blur(10px) hue-rotate(90deg)'
            />
            <ModalContent mx={4}>
                <ModalCloseButton />
                <Scheduler
                    isDatePick
                    contentType="WORK_TIME"
                    value={value}
                    onChange={(value) => {
                        onChange(value)
                        onClose()
                    }}
                    selectFirst
                />
            </ModalContent>
        </Modal>
    </>
}