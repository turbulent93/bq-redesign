"use client"

import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { CustomSelect } from "@/components/CustomSelect"
import { PromoDto, PromoServiceDto } from "@/services/client"
import { servicesClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { Box, Flex, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text } from "@chakra-ui/react"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useQuery } from "react-query"

type PromoServiceFormProps = {
    isOpen: boolean
    onClose: () => void
    values?: PromoServiceDto
    items: PromoServiceDto[]
    setItems: (value: PromoServiceDto[]) => void
    currentService?: PromoServiceDto
    setCurrentService: (value?: PromoServiceDto) => void
}

const UNITS = ["р", "%"].map(i => ({value: i, label: i}))

export const PromoServiceForm = ({isOpen, onClose, values, items, setItems, currentService, setCurrentService}: PromoServiceFormProps) => {
    const {data: services} = useQuery(
        ["get services by excluded ids"],
        () => servicesClient.get({page: undefined, size: undefined, exludedIds: items ? items.map(i => i.serviceId!) : []}), {
            select: (data) => data.list.map(i => ({label: i.name, value: i.id}))
        }
    )

    useEffect(() => {
        console.log(items)
    }, [items])

    return <Modal
        isOpen={isOpen}
        onClose={() => {
            setCurrentService()
            onClose()
        }}
        isCentered
    >
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
        <ModalContent mx={4} py={6}>
            <ModalCloseButton />
            <Text fontSize={18} ml={4} mb={2} fontWeight="bold">
                Добавить услугу
            </Text>
            <CustomForm
                onSubmit={(v: PromoServiceDto) => {
                    if(v.id) {
                        setItems(items.map(i => {
                            if(i.id != currentService?.id)
                                return i
                            // console.log(values)
                            return {...v!}
                        }))
                    } else {
                        setItems([...items, v])
                    }
                    // console.log(values)
                    setCurrentService()
                    onClose()
                }}
                submitText="Добавить"
                values={values}
            >
                <CustomSelect
                    label="Услуга"
                    name={nameof<PromoServiceDto>("serviceId")}
                    required
                    options={services ?? []}
                    // defaultValue={services?.find(i => i.value == values?.serviceId)}
                />
                {/* <Flex alignItems={"end"}> */}
                    <Box mr={2}>
                        <CustomInput
                            label="Итоговая цена"
                            name={nameof<PromoServiceDto>("discount")}
                            required
                            rightElement="₽"
                        />
                    </Box>
                    {/* <Box w="120px">
                        <CustomSelect
                            label=""
                            name={nameof<PromoServiceDto>("unit")}
                            required
                            options={UNITS}
                        />
                    </Box>
                </Flex> */}
                
            </CustomForm>
        </ModalContent>
    </Modal>
}