import { PromoDto, PromoServiceDto } from "@/services/client"
import { nameof } from "@/utils/nameof"
import { Button } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { CiCirclePlus } from "react-icons/ci"
import { PromoServicesList } from "./PromoServicesList"
import { CustomInput } from "@/components/CustomInput"
import { useEffect } from "react"

const PROMO_TYPES = ["Скидка на услуги", "Начисление бонусов", "Бесплатные услуги"]

type FormContent = {
    onOpen: () => void
    items: PromoServiceDto[]
    setItems: (value: PromoServiceDto[]) => void
    currentService?: PromoServiceDto
    setCurrentService: (value?: PromoServiceDto) => void
}

export const FormContent = ({onOpen, ...listProps}: FormContent) => {
    const {watch} = useFormContext()
    const promoType = watch(nameof<PromoDto>("type"))

    useEffect(() => {
        console.log(promoType)
    }, [promoType])

    return promoType == PROMO_TYPES[0] || promoType == PROMO_TYPES[2]
        ? <>
            <Button
                leftIcon={<CiCirclePlus size={24}/>}
                mb={2}
                onClick={onOpen}
            >Добавить услугу</Button>
            <PromoServicesList
                {...listProps}
            />
        </>
        : <CustomInput
            label="Количество бонусов"
            name={nameof<PromoDto>("bonusCount")}
            required
        />
}