import { TokenDto } from "@/services/client"

const ACCESS_TOKEN = "accessToken",
    REFRESH_TOKEN = "refreshToken"

export const getTokens = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    const refreshToken = localStorage.getItem(REFRESH_TOKEN)

    if(!accessToken || !refreshToken) {
        return
    }

    return {
        accessToken,
        refreshToken
    }
}

export const setTokens = (tokens: TokenDto) => {
    localStorage.setItem(ACCESS_TOKEN, tokens.accessToken)
    localStorage.setItem(REFRESH_TOKEN, tokens.refreshToken)
}

export const removeTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
}