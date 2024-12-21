import { AppointmentCard } from "@/app/profile/AppointmentCard"
import { AppointmentDto } from "@/services/client"
import { useFormContext } from "react-hook-form"

export const AppointmentTemplate = () => {
    const {watch} = useFormContext<AppointmentDto>()
    
    const values = watch()

    return <AppointmentCard {...values} />
}