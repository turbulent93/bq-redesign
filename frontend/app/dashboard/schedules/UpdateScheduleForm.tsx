import { CustomForm } from "@/components/CustomForm"
import { CustomSelect } from "@/components/CustomSelect"
import { TimeSelect } from "@/components/TimeSelect"
import { TimeSlider } from "@/components/TimeSlider"
import { ScheduleDto } from "@/services/client"
import { schedulesClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { Button, Flex, Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "react-query"

type UpdateShceduleForm = {
    scheduleId?: number
    onClose: () => void
}

export const UpdateScheduleForm = ({scheduleId, onClose}: UpdateShceduleForm) => {
    const queryClient = useQueryClient()

    const {data} = useQuery(["get schedule", scheduleId], () => schedulesClient.view(scheduleId!), {
        enabled: !!scheduleId
    })

    const {mutate: updateMutate} = useMutation((value: ScheduleDto) => schedulesClient.update(value.id!, value), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: "get schedules"})
            onClose()
        }
    })

    const {mutate: removeMutate} = useMutation((id: number) => schedulesClient.remove(id), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: "get schedules"})
            onClose()
        }
    })

    const RemoveScheduleButton = () => {
        return <Button
            mt={2}
            ml={2}
            color={"white"}
            bgColor={"red.300"}
            _hover={{
                bgColor: "red.200"
            }}
            onClick={() => removeMutate(scheduleId!)}
        >Удалить</Button>
    }

    return <CustomForm onSubmit={updateMutate} values={data} submitText="Обновить" buttons={[RemoveScheduleButton]}>
        <TimeSelect
            name={nameof<ScheduleDto>("startAt")}
            label="Время начала"
        />
        <TimeSelect
            name={nameof<ScheduleDto>("endAt")}
            label="Время окончания"
        />
    </CustomForm>
}