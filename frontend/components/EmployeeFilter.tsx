import { usersClient } from "@/services/services"
import { MASTER_ROLE_NAME } from "@/utils/constants"
import { useAuth } from "@/utils/useAuth"
import { Box } from "@chakra-ui/react"
import { Select } from "chakra-react-select"
import { useQuery } from "react-query"

type EmployeeFilterProps = {
    userId?: number
    setUserId: (v?: number) => void
}

export const EmployeeFilter = ({userId, setUserId}: EmployeeFilterProps) => {
    const {isAdmin} = useAuth()

    const {data: users} = useQuery(
        ["get users"],
        () => usersClient.get({page: undefined, size: undefined, role: MASTER_ROLE_NAME}), {
            select: (data) => data.list.map(i => ({label: i.fullName || i.login, value: i.id})),
            onSuccess: (data) => setUserId(data.length > 0 ? data[0].value : undefined)
        }
    )

    return <>
        {
            isAdmin && <Box w="100%" my={3}>
                <Select
                    options={users}
                    value={users?.find(i => i.value == userId)}
                    onChange={(v) => setUserId(v?.value)}
                    placeholder="Мастер"
                />
            </Box>
        }
    </>
}