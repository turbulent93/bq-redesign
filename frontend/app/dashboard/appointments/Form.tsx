import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { FormDateInput } from "@/components/FormDateInput"
import { AppointmentDto } from "@/services/client"
import { nameof } from "@/utils/nameof"
import { AvailableTime } from "./AvailableTime"
import { useQuery } from "react-query"
import { promosClient, servicesClient } from "@/services/services"
import { CustomSelect } from "@/components/CustomSelect"
import { TimeSelect } from "@/components/TimeSelect"
import { useMemo, useState } from "react"
import { countBonuses } from "@/utils/countBonuses"
import { AvailableBonuses } from "./AvailableBonuses"
import { EndTime } from "./EndTime"
import { EmployeeFilter } from "@/components/EmployeeFilter"
import { useAuth } from "@/utils/useAuth"
import { ADMIN_ROLE_NAME, MASTER_ROLE_NAME, PROMO_TYPE_DISCOUNT } from "@/utils/constants"
import { StartTime } from "./StartTime"
import { AppointmentCard } from "@/app/profile/AppointmentCard"
import { AppointmentTemplate } from "./AppointmentTemplate"
import { SelectEmployee } from "./SelectEmployee"

type FormProps = {
    mutate: (item: AppointmentDto) => void,
    values?: AppointmentDto
}

export const Form = ({mutate, values}: FormProps) => {
    const {user} = useAuth()

    // const [userId, setUserId] = useState<number | undefined>()

    const {data: services} = useQuery(
        ["get services"],
        () => servicesClient.get({page: undefined, size: undefined}), {
            select: (data) => data.list.map(i => ({label: i.name, value: i.id}))
        }
    )
    const {data: promos} = useQuery(
        ["get promos"],
        () => promosClient.get({onlyCurrent: true, type: PROMO_TYPE_DISCOUNT}), {
            select: (data) => data.list.map(i => ({label: i.title, value: i.id}))
        }
    )

    return <CustomForm
        onSubmit={v => mutate({...v})}
        // onSubmit={(v) => console.log(v)}
        // values={values ? values : {startAt: user?.startWorkTime}}
        values={values}
        px={0}
    >
        <AppointmentTemplate />
        <SelectEmployee />
        <CustomSelect
            label="Услуга"
            name={nameof<AppointmentDto>("serviceId")}
            required
            options={services ?? []}
        />
        <FormDateInput
            label="День"
            name={nameof<AppointmentDto>("scheduleId")}
            type="schedule"
        />
        <AvailableTime />
        <StartTime />
        <EndTime />
        <CustomSelect
            label="Промо"
            name={nameof<AppointmentDto>("promoId")}
            options={promos ?? []}
        />
        <CustomInput
            type="phone"
            label="Телефон"
            name={nameof<AppointmentDto>("phone")}
            required
        />
        <AvailableBonuses />
    </CustomForm>
}