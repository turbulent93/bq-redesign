import { EmployeeFilter } from "@/components/EmployeeFilter"
import { AppointmentDto } from "@/services/client"
import { nameof } from "@/utils/nameof"
import { useAuth } from "@/utils/useAuth"
import { useFormContext } from "react-hook-form"

export const SelectEmployee = () => {
    const {isAdmin} = useAuth()
    const {watch, setValue} = useFormContext()

    return isAdmin && <EmployeeFilter
        userId={watch(nameof<AppointmentDto>("employeeId"))}
        setUserId={(v) => setValue(nameof<AppointmentDto>("employeeId"), v)}
    />
}