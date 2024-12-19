import { PhoneInput } from "@/components/PhoneInput"
import { CustomInput } from "../CustomInput"
import { Text } from "@chakra-ui/react"
import { useAuth } from "@/utils/useAuth"
import moment from "moment"
import { CLIENT_ROLE_NAME, DATE_FORMAT, PROMO_TYPE_BONUS } from "@/utils/constants"
import { AppointmentDto, TokenRequest } from "@/services/client"
import { nameof } from "@/utils/nameof"
import { useEffect, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { servicesClient, tokensClient } from "@/services/services"
import { countBonuses } from "@/utils/countBonuses"
import { setTokens } from "@/api/api.handler"

export const PhoneStep = ({promoId, phone}: {promoId?: number, phone?: string}) => {
    const {user, isAuth} = useAuth()
    const queryClient = useQueryClient()

    const {watch} = useFormContext()

    const serviceId = watch(nameof<AppointmentDto>("serviceId"))

    const formPhone = watch(nameof<AppointmentDto>("phone"))

    const {mutate} = useMutation((data: TokenRequest) => tokensClient.fastRegister({login: data.login}), {
        onSuccess: (data) => {
            setTokens(data)
            queryClient.invalidateQueries(["check"])
        }
    })

    const {data: service} = useQuery(
        ["view service", serviceId],
        () => servicesClient.view(serviceId), {
            enabled: !!serviceId && isAuth
        }
    )

    const bonusCount = useMemo(() => countBonuses(user), [user])

    const availableBonusCount = useMemo(() => service?.paidAmountWithBonuses
        ? service?.paidAmountWithBonuses >= bonusCount
            ? bonusCount
            : service?.paidAmountWithBonuses
        :0,
    [service, bonusCount])

    useEffect(() => {
        console.log(formPhone, formPhone.length)
        if(formPhone && formPhone.length == 16) {
            mutate({login: formPhone})
        }
    }, [formPhone])

    useEffect(() => {
        console.log(promoId, availableBonusCount)
    }, [promoId, availableBonusCount])

    return <>
        <CustomInput name="phone" label="Телефон" defaultValue={phone ? phone : user?.role == CLIENT_ROLE_NAME ? user?.login : ""} type="phone"/>
        {
            !promoId && availableBonusCount > 0 && <CustomInput 
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