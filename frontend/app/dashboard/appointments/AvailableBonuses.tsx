import { CustomInput } from "@/components/CustomInput"
import { AppointmentDto } from "@/services/client"
import { servicesClient, usersClient } from "@/services/services"
import { countBonuses } from "@/utils/countBonuses"
import { nameof } from "@/utils/nameof"
import { useEffect, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { useQuery } from "react-query"

export const AvailableBonuses = () => {
    const {watch} = useFormContext()
    const phone = watch(nameof<AppointmentDto>("phone"))
    const serviceId = watch(nameof<AppointmentDto>("serviceId"))

    const {data: service} = useQuery(
        ["view service", serviceId],
        () => servicesClient.view(serviceId), {
            enabled: !!serviceId
        }
    )
    
    const {data} = useQuery(
        ["get users", phone],
        () => usersClient.viewByPhone(phone), {
            enabled: !!phone && phone.length == 16
        }
    )

    const bonusCount = useMemo(() => !!data ? countBonuses(data) : 0, [data])

    const availableBonusCount = useMemo(() => service?.paidAmountWithBonuses
        ? service?.paidAmountWithBonuses >= bonusCount
            ? bonusCount
            : service?.paidAmountWithBonuses
        :0,
    [service, bonusCount])

    useEffect(() => {
        console.log(bonusCount, availableBonusCount)
    }, [bonusCount, availableBonusCount])

    return availableBonusCount > 0 && <CustomInput
        label={`Доступно ${availableBonusCount} бонусов. Использовать:`}
        name={nameof<AppointmentDto>("paidWithBonuses")}
        type="number"
        min={0}
        max={availableBonusCount}
        defaultValue={"0"}
    />
} 