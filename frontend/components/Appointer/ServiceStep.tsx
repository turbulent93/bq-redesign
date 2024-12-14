'use client';

import { PriceList } from "@/app/PriceList";
import { ColumnType, CustomTable } from "@/components/Table/Table";
import { AppointmentDto, ServiceDto } from "@/services/client";
import { serviceGroupClient, servicesClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { Button, Container, Flex, Switch, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "react-query";

type ServiceStepProps = {
    goToNext: () => void
    setDuration: (value: number) => void
    promoId?: number
}


const AppointerPriceList = ({onClick, promoId}: {onClick: (v: ServiceDto) => void, promoId?: number}) => {
    const {setValue, reset, getValues} = useFormContext()

    useEffect(() => {
        reset({...getValues(), [nameof<AppointmentDto>("promoId")]: promoId})
    }, [promoId])

    const {data: serviceGroups, isLoading: isServiceGroupsLoading} = useQuery(
        ["get service-groups", promoId],
        () => serviceGroupClient.get({promoId: promoId ? promoId : undefined}), {
			select: (data) => data.list
			// onSuccess: (data) => console.log(data)
		}
    )

    return <PriceList
        onClick={(v) => {
            onClick(v)
            setValue(nameof<AppointmentDto>("serviceId"), v.id)
            // console.log("set service", v.id)
        }}
        viewTitle={false}
        items={serviceGroups}
    />
}


export default function ServiceStep({goToNext, setDuration, promoId}: ServiceStepProps) {
    const {setValue} = useFormContext()
    const [usePromo, setUsePromo] = useState(true)

    return <>
        {
            !!promoId && <Flex mb={4} alignItems={"center"} justifyContent={"center"}>
                <Text mr={4}>
                    Использовать акцию
                </Text>
                <Switch
                    isChecked={usePromo}
                    onChange={(e) => {
                        setUsePromo(e.target.checked)
                        if(e.target.checked) {
                            setValue(nameof<AppointmentDto>("promoId"), promoId)
                        } else {
                            setValue(nameof<AppointmentDto>("promoId"), undefined)
                        }
                    }}
                    variant={"gray"}
                />
            </Flex>
        }
        <AppointerPriceList 
            onClick={(v) => {
                setDuration(v.duration)
                
                goToNext()
            }}
            promoId={usePromo ? promoId : undefined}
        />
    </>
}
