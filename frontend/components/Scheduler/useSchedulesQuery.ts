import { ScheduleDayDto } from "@/services/client"
import { schedulesClient } from "@/services/services"
import { useQuery } from "react-query"

type SchedulesQueryProps = {
    month: number
    year: number
    employeeId?: number
    duration?: number
    contentType?: "COUNT" | "SLOTS" | "WORK_TIME"
    onSuccess?: (data: ScheduleDayDto[]) => void
}

export const useSchedulesQuery = ({month, year, employeeId, duration, contentType = "SLOTS", onSuccess}: SchedulesQueryProps) => {
    const {data, isLoading} = useQuery(
        ["get schedules", month, year, employeeId],
        () => schedulesClient.get({
            employeeId,
            month,
            year,
            duration,
            contentType
        }), {
            refetchInterval: false,
            onSuccess
        })

    return {
        data,
        isLoading
    }
}