import { PhoneInput } from "@/components/PhoneInput"
import { CustomInput } from "../CustomInput"
import { Text } from "@chakra-ui/react"
import { useAuth } from "@/utils/useAuth"
import moment from "moment"
import { CLIENT_ROLE_NAME, PROMO_TYPE_BONUS } from "@/utils/constants"
import { AppointmentDto } from "@/services/client"
import { nameof } from "@/utils/nameof"
import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { useQuery } from "react-query"
import { servicesClient } from "@/services/services"

export const PhoneStep = ({promoId}: {promoId?: number}) => {
    const {user: data} = useAuth()

    const {watch} = useFormContext()

    const serviceId = watch(nameof<AppointmentDto>("serviceId"))

    const {data: service} = useQuery(
        ["view service", serviceId],
        () => servicesClient.view(serviceId), {
            onSuccess: (data) => console.log(data),
            enabled: !!serviceId
        }
    )

    const bonusCount = useMemo(() => data
            ?.appointments
            ?.filter(i => moment(i.schedule?.date, "DD.MM.YYYY HH:mm:ss").isSameOrAfter(moment().month(-3))
                && i.paidWithBonuses == 0)
            .reduce((c, i) => c + i.service?.bonusCount!, 0)!
        + data
            ?.promos
            ?.filter(i => (!i.startDate || moment(i.startDate, "DD.MM.YYYY HH:mm:ss").isSameOrBefore(moment()))
                && (!i.endDate || moment(i.endDate, "DD.MM.YYYY HH:mm:ss").isSameOrAfter(moment()))
                && i.type == PROMO_TYPE_BONUS)
            .reduce((c, i) => c + (i?.bonusCount || 0), 0)!
        - data
            ?.appointments
            ?.filter(i => i.paidWithBonuses && i.paidWithBonuses > 0)
            .reduce((c, i) => c + i.paidWithBonuses!, 0)!, [data])

    const availableBonusCount = useMemo(() => service?.paidAmountWithBonuses
        ? service?.paidAmountWithBonuses >= bonusCount
            ? bonusCount
            : service?.paidAmountWithBonuses
        :0,
    [service, bonusCount])

    return <>
        <CustomInput name="phone" label="Телефон" defaultValue={data?.role == CLIENT_ROLE_NAME ? data?.login : ""} type="phone"/>
        {
            !promoId && <CustomInput 
                label={`Доступно ${availableBonusCount} бонусов. Использовать:`}
                name={nameof<AppointmentDto>("paidWithBonuses")}
                type="number"
                min={0}
                max={availableBonusCount}
                defaultValue={"0"}
            />
        }
    </>
}