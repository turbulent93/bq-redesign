import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { CustomSelect } from "@/components/CustomSelect"
import { DateInput } from "@/components/DateInput"
import { FormDateInput } from "@/components/FormDateInput"
import { SchedulerValue } from "@/components/Scheduler/Scheduler"
import { TimeSlider } from "@/components/TimeSlider"
import { PromoDto, PromoServiceDto, ServiceDto } from "@/services/client"
import { servicesClient, specializationsClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { Box, Button, Flex, Image, Input, Text, useDisclosure } from "@chakra-ui/react"
import moment from "moment"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"
import { PromoTemplate } from "./PromoTemplate"
import { FileUpload } from "@/components/FileUpload"
import { PromoServiceForm } from "./PromoServiceForm"
import { PromoServicesList } from "./PromoServicesList"
import { CiCirclePlus } from "react-icons/ci";
import { FormContent } from "./FormContent"
import { CustomSwitch } from "@/components/CustomSwitch"
import { PROMO_TYPES } from "@/utils/constants"
import { PromoLimits } from "./PromoLimits"
import { TimeSelect } from "@/components/TimeSelect"

type FormProps = {
    mutate: (item: PromoDto) => void,
    values?: PromoDto
}

export const Form = ({mutate, values}: FormProps) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [promoServices, setPromoServices] = useState<PromoServiceDto[]>([])
    const [currentService, setCurrentService] = useState<PromoServiceDto>()

    useEffect(() => {
        if(currentService)
            onOpen()
    }, [currentService])

    useEffect(() => {
        if(values?.promoServices)
            setPromoServices(values?.promoServices)
    }, [values])

    return <>
        <CustomForm
            // onSubmit={(value) => console.log(value)/* mutate({...value, promoServices}) */ }
            onSubmit={(value) => mutate({...value, promoServices})}
            values={values}
            defaultValues={{startAt: "9:00", endAt: "18:00", type: PROMO_TYPES[0]}}
        >
            <PromoTemplate />
            <FileUpload
                name={nameof<PromoDto>("imageId")}
                aspectRatio={3 / 2}
            />
            <CustomInput
                label="Заголовок"
                name={nameof<PromoDto>("title")}
                required
            />
            <CustomInput
                type="textarea"
                label="Описание"
                name={nameof<PromoDto>("description")}
            />
            <Box py={2} borderTop={"1px"} borderBottom={"1px"} borderColor={"gray.300"} mb={3} mt={1}>
                <Text fontSize={20} color={"gray.700"} mb={4} fontWeight={"bold"}>
                    Ограничения по применению
                </Text>
                <FormDateInput
                    label="Дата начала"
                    name={nameof<PromoDto>("startDate")}
                />
                <FormDateInput
                    label="Дата окончания"
                    name={nameof<PromoDto>("endDate")}
                    />
                <PromoLimits />
                <TimeSelect
                    name={nameof<PromoDto>("startAt")}
                    label="Время начала"
                    />
                <TimeSelect
                    name={nameof<PromoDto>("endAt")}
                    label="Время окончания"
                />
            </Box>
            <CustomSelect
                label="Тип"
                name={nameof<PromoDto>("type")}
                required
                options={PROMO_TYPES.map(i => ({value: i, label: i})) ?? []}
                // defaultValue={PROMO_TYPES[0]}
            />
            <FormContent
                onOpen={onOpen}
                items={promoServices}
                setItems={setPromoServices}
                currentService={currentService}
                setCurrentService={setCurrentService}
            />
            <Box py={3} borderTop={"1px"} borderBottom={"1px"} borderColor={"gray.300"} mb={3} mt={1}>
                <CustomSwitch
                    name={nameof<PromoDto>("showOnHomePage")}
                    label={"Показывать на главной странице"}
                />
            </Box>
        </CustomForm>
        <PromoServiceForm
            isOpen={isOpen}
            onClose={onClose}
            items={promoServices}
            setItems={setPromoServices}
            values={currentService}
            currentService={currentService}
            setCurrentService={setCurrentService}
        />
    </>
}