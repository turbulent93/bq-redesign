'use client';

import { DashboardHeader } from "@/components/DashboardHeader";
import { ColumnType, CustomTable } from "@/components/Table/Table";
import { PunchMapDto, PunchMapPromoDto, ServiceDto } from "@/services/client";
import { servicesClient } from "@/services/services";
import { nameof } from "@/utils/nameof";
import { useAuth } from "@/utils/useAuth";
import { Box, Button, Container, Flex, Grid, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { DashboardNavigation } from "../../../components/DashboardNavigation";
import { promoRoutes, serviceRoutes } from "@/components/Sidebar/routes";
import { MdQuestionMark } from "react-icons/md";
import { PromoTemplate } from "../promos/PromoTemplate";
import { PromoCard } from "@/components/cards/PromoCard";
import { IoCheckmark } from "react-icons/io5";
import { SlPresent } from "react-icons/sl";
import { CustomForm } from "@/components/CustomForm";
import { CustomInput } from "@/components/CustomInput";
import { PunchMapTemplate } from "./PunchMapTemplate";
import { PunchMapPromoForm } from "./PunchMapPromoForm";

type FormProps = {
    mutate: (item: PunchMapDto) => void,
    values?: PunchMapDto
}

export default function Form({mutate, values}: FormProps) {
    const {user} = useAuth()
    const [punchMapPromos, setPunchMapPromos] = useState<PunchMapPromoDto[]>([])


    const {onOpen, onClose, isOpen} = useDisclosure()

    const [curStep, setCurStep] = useState<PunchMapPromoDto>()

    useEffect(() => {
        if(values)
            setPunchMapPromos(values?.punchMapPromos)
    }, [values])

    return <>
        <CustomForm
            onSubmit={(value) => {
                mutate({
                    ...value,
                    punchMapPromos: punchMapPromos.map(i => ({...i, promo: undefined}))
                })
            }}
            values={values}
            >
            <CustomInput
                label="Количество шагов"
                name={nameof<PunchMapDto>("stepsCount")}
                required
                defaultValue={6}
                type="number"
                />
            <CustomInput
                label="Количество колонок"
                name={nameof<PunchMapDto>("columnsCount")}
                required
                defaultValue={3}
                type="number"
                min={2}
                max={6}
                />
            <PunchMapTemplate
                items={punchMapPromos}
                setItems={setPunchMapPromos}
                onOpen={(value) => {
                    setCurStep(value)
                    onOpen()
                }}
            />
        </CustomForm>
        <PunchMapPromoForm
            isOpen={isOpen}
            items={punchMapPromos}
            onClose={() => {
                setCurStep(undefined)
                onClose()
            }}
            setItems={setPunchMapPromos}
            currentItem={curStep}
        />
    </>
}
