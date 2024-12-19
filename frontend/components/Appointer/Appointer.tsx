"use client"

import { CustomForm } from "@/components/CustomForm"
import { AppointmentDto, ServiceDto } from "@/services/client"
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
import { AppointerContent } from "./AppointerContent"
import { UsePromo } from "./UsePromo"

type FormProps = {
    mutate: (item: AppointmentDto) => void,
    values?: AppointmentDto
    promoId?: number
    phone?: string
    inviterId?: number
}

const steps = [
    { title: 'Услуга', Icon: FaCogs },
    { title: 'Мастер', Icon: AiOutlineUser },
    { title: 'Дата и время', Icon: AiOutlineSchedule },
    { title: 'Телефон', Icon: FaPhone },
]

export const Appointer = ({mutate, values, promoId, phone, inviterId}: FormProps) => {
    const { activeStep, goToNext, setActiveStep } = useSteps({
        index: 1,
        count: steps.length,
    })

    const [usePromo, setUsePromo] = useState(true)

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
            <UsePromo
                usePromo={usePromo}
                setUsePromo={setUsePromo}
                promoId={promoId}
            />  
            <AppointerContent
                index={activeStep}
                goToNext={goToNext}
                setActiveStep={setActiveStep}
                promoId={usePromo ? promoId : undefined}
                phone={phone}
                inviterId={inviterId}
            />
        </CustomForm>
    </Container>
}