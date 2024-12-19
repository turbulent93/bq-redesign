import { PromoDto, PromoServiceDto } from "@/services/client"
import { nameof } from "@/utils/nameof"
import { Button } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { CiCirclePlus } from "react-icons/ci"
import { PromoServicesList } from "./PromoServicesList"
import { CustomInput } from "@/components/CustomInput"
import { useEffect } from "react"
import { PROMO_TYPE_DISCOUNT, PROMO_TYPES } from "@/utils/constants"

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

    return promoType == PROMO_TYPE_DISCOUNT
        ? <>
            <Button
                // bgColor={"gray.700"}
                // color={"white"}
                leftIcon={<CiCirclePlus size={24}/>}
                mb={2}
                onClick={onOpen}
                w="100%"
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