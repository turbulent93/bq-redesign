"use client"

import { CustomForm } from "@/components/CustomForm"
import { AppointmentDto, EmployeeDto, ServiceDto } from "@/services/client"
import { Box, Container, Flex, Grid, Step, StepDescription, StepIcon, StepIndicator, StepNumber, Stepper, StepSeparator, StepStatus, StepTitle, Switch, Text, useSteps } from "@chakra-ui/react"
import EmployeeStep from "./EmployeeStep"
import ServiceStep from "./ServiceStep"
import { AiOutlineSchedule, AiOutlineUser } from "react-icons/ai"
import { FaCogs, FaPhone } from "react-icons/fa"
import { PhoneStep } from "./PhoneStep"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import moment from "moment"
import { nameof } from "@/utils/nameof"
import { ScheduleStep } from "./ScheduleStep"
import { PriceList } from "@/app/PriceList"
import { serviceGroupClient } from "@/services/services"
import { useQuery } from "react-query"
import { CustomSwitch } from "../CustomSwitch"

type FormProps = {
    mutate: (item: AppointmentDto) => void,
    values?: AppointmentDto
    promoId?: number
}

const steps = [
    { title: 'Услуга', Icon: FaCogs },
    { title: 'Мастер', Icon: AiOutlineUser },
    { title: 'Дата и время', Icon: AiOutlineSchedule },
    { title: 'Телефон', Icon: FaPhone },
]

type ContentProps = {
    index: number
    goToNext: () => void
    setActiveStep: (value: number) => void
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

const Content = ({index, goToNext, setActiveStep, promoId}: ContentProps) => {
    const [duration, setDuration] = useState<number>()
    const [usePromo, setUsePromo] = useState(true)

    const {setValue} = useFormContext()

    if(index == 1) {
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
    } else if(index == 2) {
        return <EmployeeStep
            goToNext={goToNext}
            goBack={() => setActiveStep(1)}
            goToPhone={() => setActiveStep(4)}
            duration={duration}
        />
    } else if(index == 3) {
        return <ScheduleStep
            duration={duration}
            goToServiceStep={() => setActiveStep(1)}
            goToNext={goToNext}
        />
    } else {
        return <PhoneStep promoId={promoId}/>
    }
}

export const Appointer = ({mutate, values, promoId}: FormProps) => {
    const { activeStep, goToNext, setActiveStep } = useSteps({
        index: 1,
        count: steps.length,
    })

    return <Container maxW="800px" px={0}>
        <Stepper
            index={activeStep}
            mx={"24px"}
            mt={8}
        >
            {steps.map(({Icon}, index) => (
                <Step key={index} onClick={() => setActiveStep(index + 1)}>
                    <StepIndicator
                        backgroundColor={index < activeStep ? "gray.700 !important" : "inherit"}
                        borderColor={index == activeStep ? "gray.700 !important" : undefined}
                    >
                        <StepStatus
                            complete={index < activeStep - 1 ? <StepIcon/> : <Icon />}
                            incomplete={<Icon />}
                            active={<Icon />}
                        />
                    </StepIndicator>
                    {
                        index != steps.length - 1 && <Box w="100%" borderBottom="1px" borderColor={"gray.700"} />
                    }

                    {/* <Box flexShrink='0' pt={1} pl={2}>
                        <StepTitle>{title}</StepTitle>
                    </Box> */}
                </Step>
            ))}
            
        </Stepper>
        <Flex mt={2} mb={4} justifyContent={"space-between"}>
            {steps.map(({title}) => <Text w="80px" textAlign={"center"} fontSize={14} key={title}>{title}</Text>)}
        </Flex>
        <CustomForm
            onSubmit={mutate}
            values={values}
            maxW={activeStep != 4 ? "800px" : undefined}
            isSubmitVisible={activeStep == 4}
            submitText="Записаться"
        >
            <Content
                index={activeStep}
                goToNext={goToNext}
                setActiveStep={setActiveStep}
                promoId={promoId}
            />
        </CustomForm>
    </Container>
}