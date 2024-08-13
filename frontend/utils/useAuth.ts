import { getTokens, removeTokens } from "@/api/api.handler"
import { TokenDto } from "@/services/client"
import { tokensClient } from "@/services/services"
import { useQuery, useQueryClient } from "react-query"
import { ADMIN_ROLE_NAME } from "./constants"

export const useAuth = () => {
    const queryClient = useQueryClient()
    const {isLoading, data} = useQuery(["check"], () => tokensClient.check({...getTokens() as TokenDto}))

    const logout = () => {
        removeTokens()
        queryClient.setQueriesData(["check"], undefined)
    }

    return {
        isLoading,
        user: data?.currentUser,
        isAuth: data?.result == "Correct",
        isAdmin: data?.currentUser?.role == ADMIN_ROLE_NAME,
        logout
    }
}