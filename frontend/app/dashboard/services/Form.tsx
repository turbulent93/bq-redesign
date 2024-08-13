import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { CustomSelect } from "@/components/CustomSelect"
import { TimeSlider } from "@/components/TimeSlider"
import { ServiceDto } from "@/services/client"
import { servicesClient, specializationsClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { Input, Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useQuery } from "react-query"

type FormProps = {
    mutate: (item: ServiceDto) => void,
    values?: ServiceDto
}

export const Form = ({mutate, values}: FormProps) => {
    const {data: specializations} = useQuery(
        ["get specializations"],
        () => specializationsClient.get({page: undefined, size: undefined}), {
            select: (data) => data.list.map(i => ({label: i.name, value: i.id}))
        }
    )

    return <CustomForm onSubmit={mutate} values={values}>
        <CustomInput
            label="Название"
            name={nameof<ServiceDto>("name")}
            required
        />
        <TimeSlider
            label="Продожительность"
            name={nameof<ServiceDto>("duration")}
        />
        <CustomInput
            label="Цена"
            name={nameof<ServiceDto>("price")}
            required
            rightElement="₽"
            type="number"
        />
        <CustomSelect
            label="Специализация"
            name={nameof<ServiceDto>("specializationId")}
            required
            options={specializations ?? []}
            defaultValue={specializations?.find(i => i.value == values?.specializationId)}
        />
    </CustomForm>
}