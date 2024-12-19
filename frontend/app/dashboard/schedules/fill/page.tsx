"use client"

import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { CustomRadio } from "@/components/CustomRadio"
import { DateInput } from "@/components/DateInput"
import { DatePicker } from "@/components/Scheduler/DatePicker"
import { SchedulerValue } from "@/components/Scheduler/Scheduler"
import { AppointmentDto, FillScheduleDto } from "@/services/client"
import { schedulesClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { Box, Card, CardBody, CardHeader, Divider, Flex, Heading, Stack, StackDivider, Switch, Text } from "@chakra-ui/react"
import moment from "moment"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { DayCountInput } from "./DayCountInput"
import { AppointmentsToRemove } from "./AppointmentsToRemove"
import { TimeSelect } from "@/components/TimeSelect"
import { useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { useAuth } from "@/utils/useAuth"
import { DATE_FORMAT } from "@/utils/constants"

const fillTypes = [
    {
        value: "DEFAULT",
        label: "Обычное"
    },
    {
        value: "ONLY_WORK_DAYS",
        label: "Только рабочие дни"
    },
    {
        value: "ONLY_WEEKEND_DAYS",
        label: "Только выходные дни"
    }
]

export default function Page() {
    const {user} = useAuth()
    const startWorkTime = "10:00"
    const endWorkTime = "18:00"

    const queryClient = useQueryClient()
    const curDate = moment()
    const router = useRouter()

    const [startDate, setStartDate] = useState<SchedulerValue | undefined>({date: curDate.format(DATE_FORMAT)})
    const [endDate, setEndDate] = useState<SchedulerValue | undefined>({date: curDate.endOf("month").format(DATE_FORMAT)})
    const [removeApplications, setRemoveApplications] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)

    // const {watch} = useFormContext()
    // const fillType = watch(nameof<FillScheduleDto>("fillType"))

    const {mutate, data} = useMutation((item: FillScheduleDto) => {
        // console.log({
        //     ...item,
        //     employeeId,
        //     startDate: startDate?.date!,
        //     endDate: endDate?.date!,
        //     removeApplications: removeApplications ? isConfirmed : false
        // })

        return schedulesClient.fill({
            ...item,
            employeeId: user?.id!,
            startDate: startDate?.date!,
            endDate: endDate?.date!,
            removeApplications: removeApplications ? isConfirmed : false
        })
    }, {
		onSuccess: () => {
            if(!isConfirmed) {
                setIsConfirmed(true)
            } else {
                queryClient.invalidateQueries({queryKey: "get applications"})
                router.push("/dahsboard/schedules")
            }
        }
	})

    return <CustomForm
        onSubmit={mutate}
        // onSubmit={(item) => console.log({
        //     ...item,
        //     employeeId,
        //     startDate: startDate?.date!,
        //     endDate: endDate?.date!,
        //     removeApplications: removeApplications ? isConfirmed : false
        // })}
        my={2}
    >
        <DateInput
            label="Дата начала"
            value={startDate}
            onChange={setStartDate}
            // disabled={fillType != "DEFAULT"}
        />
        <DateInput
            label="Дата окончания"
            value={endDate}
            onChange={setEndDate}
            // disabled={fillType != "DEFAULT"}
        />
        <DayCountInput />
        {/* <Divider border={"1px"} borderColor={"gray.200"} my={2}/> */}
        <CustomRadio
            items={fillTypes}
            label="Тип заполнения"
            name={nameof<FillScheduleDto>("fillType")}
        />
        <TimeSelect
            label="Время начала"
            name={nameof<FillScheduleDto>("startAt")}
            defaultValue={startWorkTime}
        />
        <TimeSelect
            label="Время окончания"
            name={nameof<FillScheduleDto>("endAt")}
            defaultValue={endWorkTime}
        />
        {/* <Divider border={"1px"} borderColor={"gray.200"} my={2}/> */}
        
        <Flex
            my={4}
            flexDir={"column"}
        >
            <Divider border={"1px"} borderColor={"gray.200"}/>
            <Flex alignItems={"end"} my={4}>
                <Text>Удалять заявки вне расписания?</Text>
                <Switch
                    isChecked={removeApplications}
                    onChange={(e) => setRemoveApplications(e.target.checked)}
                    ml={4}
                    variant={"red"}
                />
            </Flex>
            <Divider border={"1px"} borderColor={"gray.200"}/>
        </Flex>
        <AppointmentsToRemove
            data={data}
        />
    </CustomForm>
}