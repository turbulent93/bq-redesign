import { ScheduleDayDto } from "@/services/client"
import { schedulesClient } from "@/services/services"
import { useQuery } from "react-query"

type SchedulesQueryProps = {
    month: number
    year: number
    employeeId?: number
    duration?: number
    startAt?: string
    endAt?: string
    contentType?: "COUNT" | "SLOTS" | "WORK_TIME"
    onSuccess?: (data: ScheduleDayDto[]) => void
    select?: (data: ScheduleDayDto[]) => any
}

export const useSchedulesQuery = ({month, year, employeeId, duration, contentType = "SLOTS", startAt, endAt, onSuccess, select}: SchedulesQueryProps) => {
    const {data, isLoading} = useQuery(
        ["get schedules", month, year, employeeId],
        () => schedulesClient.get({
            employeeId,
            month,
            year,
            duration,
            contentType,
            startAt,
            endAt
        }), {
            refetchInterval: false,
            onSuccess,
            select
        })

    return {
        data,
        isLoading
    }
}