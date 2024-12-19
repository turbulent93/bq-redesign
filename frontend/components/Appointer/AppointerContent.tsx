import EmployeeStep from "./EmployeeStep"
import { PhoneStep } from "./PhoneStep"
import { useEffect, useState } from "react"
import { ScheduleStep } from "./ScheduleStep"
import ServiceStep from "./ServiceStep"
import { useFormContext } from "react-hook-form"
import { nameof } from "@/utils/nameof"
import { AppointmentDto } from "@/services/client"

type ContentProps = {
    index: number
    goToNext: () => void
    setActiveStep: (value: number) => void
    promoId?: number
    phone?: string
    inviterId?: number
}

export const AppointerContent = ({index, goToNext, setActiveStep, promoId, phone, inviterId}: ContentProps) => {
    const [duration, setDuration] = useState<number>()
    const {reset, getValues} = useFormContext()

    useEffect(() => {
        reset({...getValues(), [nameof<AppointmentDto>("inviterId")]: inviterId})
    }, [inviterId])

    if(index == 1) {
        return <ServiceStep
            goToNext={goToNext}
            setDuration={setDuration}
            promoId={promoId}
        />
    } else if(index == 2) {
        return <EmployeeStep
            goToNext={goToNext}
            goBack={() => setActiveStep(1)}
            goToPhone={() => setActiveStep(4)}
            duration={duration}
            promoId={promoId}
        />
    } else if(index == 3) {
        return <ScheduleStep
            duration={duration}
            goToServiceStep={() => setActiveStep(1)}
            goToNext={goToNext}
            promoId={promoId}
        />
    } else {
        return <PhoneStep promoId={promoId} phone={phone}/>
    }
}