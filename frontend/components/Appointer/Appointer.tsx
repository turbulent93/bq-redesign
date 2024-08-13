import { CustomForm } from "@/components/CustomForm"
import { AppointmentDto, EmployeeDto } from "@/services/client"
import { Box, Container, Step, StepIcon, StepIndicator, StepNumber, Stepper, StepSeparator, StepStatus, StepTitle, useSteps } from "@chakra-ui/react"
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

type FormProps = {
    mutate: (item: AppointmentDto) => void,
    values?: AppointmentDto
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
}

const Content = ({index, goToNext, setActiveStep}: ContentProps) => {
    const [duration, setDuration] = useState<number>()

    if(index == 1) {
        return <ServiceStep
            goToNext={goToNext}
            setDuration={setDuration}
        />
    } else if(index == 2) {
        return <EmployeeStep
            goToNext={goToNext}
            goBack={() => setActiveStep(1)}
        />
    } else if(index == 3) {
        return <ScheduleStep
            duration={duration}
            goToServiceStep={() => setActiveStep(1)}
            goToNext={goToNext}
        />
    } else {
        return <PhoneStep />
    }
}

export const Appointer = ({mutate, values}: FormProps) => {
    const { activeStep, goToNext, setActiveStep } = useSteps({
        index: 1,
        count: steps.length,
    })

    return <Container maxW="800px" px={0}>
        <Stepper index={activeStep} colorScheme="gray" px={4}>
            {steps.map(({Icon, title}, index) => (
                <Step key={index}>
                    <StepIndicator onClick={() => setActiveStep(index + 1)} cursor={"pointer"}>
                        <StepStatus
                            complete={<StepIcon />}
                            incomplete={<Icon />}
                            active={<Icon />}
                        />
                    </StepIndicator>
                    <StepSeparator />
                </Step>
            ))}
        </Stepper>
        <CustomForm
            onSubmit={mutate}
            values={values}
            maxW={activeStep != 4 ? "800px" : undefined}
            isSubmitVisible={activeStep == 4}
            submitText="Записаться"
        >
            <Content index={activeStep} goToNext={goToNext} setActiveStep={setActiveStep}/>
        </CustomForm>
    </Container>
}