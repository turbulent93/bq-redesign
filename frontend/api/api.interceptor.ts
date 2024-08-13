import axios from "axios"
import { getTokens, setTokens } from "./api.handler"
import { tokensClient } from "@/services/services"
import { TokenDto } from "@/services/client"

export const instance = axios.create({
    baseURL: process.env.SERVER_URL,
    transformResponse: data => data
})

instance.interceptors.request.use(async config => {
    config.headers.Authorization = `Bearer ${getTokens()?.accessToken}`

    return config
})  

instance.interceptors.response.use(async config => config,
    async errors => {
        const origRequest = errors.config
        if(errors?.response?.status == 401 && errors.config && !errors._isRetry) {
            origRequest._isRetry = true

            try {
                const res = await tokensClient.refresh({...getTokens() as TokenDto})
                if(res) {
                    setTokens(res)

                    return instance.request(origRequest)
                }
            } catch (e) {
                // const axiosError = e as AxiosError

                // if(axiosError.status != 401) {
                //     throw e
                // }
            }
        } else {
            throw errors
        }

    })