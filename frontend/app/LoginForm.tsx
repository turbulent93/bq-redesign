"use client"

import { setTokens } from "@/api/api.handler"
import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { TokenRequest } from "@/services/client"
import { tokensClient } from "@/services/services"
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { RiEyeCloseFill, RiEyeCloseLine, RiEyeLine } from "react-icons/ri"
import { useMutation, useQuery, useQueryClient } from "react-query"

export const LoginForm = () => {
    const queryClient = useQueryClient()
    const toast = useToast()

    const {mutate} = useMutation((data: TokenRequest) => tokensClient.login(data), {
        onSuccess: (data) => {
            console.log(data)
            setTokens(data)
            queryClient.invalidateQueries(["check"])
            toast({
                title: "Вход прошел успешно",
                status: "success"
            })
        }
    })

    const {register, handleSubmit} = useForm<TokenRequest>()

    return <Flex
        alignItems="center"
        justifyContent="center"
        h="100vh"
        w="100%"
        bgGradient='linear(to-br, gray.700, red.500)'
    >
        <Box 
            // borderRadius="5px"
            p={4}
            boxShadow='md'
            
        >
            <form onSubmit={handleSubmit((data) => mutate(data))}>
                <Text
                    textColor={"white"}
                    fontSize={20}
                    fontWeight={"bold"}
                    mb={4}
                >
                    Войти
                </Text>
                <Text
                    mb={2}
                    textColor={"white"}
                >Логин</Text>
                <Input
                    mb={4} 
                    variant={"flushed"}
                    placeholder="Не заполнено"
                    focusBorderColor="white"
                    textColor={"white"}
                    {...register("login")}
                />
                <Text
                    mb={1}
                    textColor={"white"}
                >Пароль</Text>
                <Input
                    mb={4}
                    variant={"flushed"}
                    placeholder="Не заполнено"
                    focusBorderColor="white"
                    textColor={"white"}
                    type="password"
                    {...register("password")}
                />
                <Button
                    bgColor={"white"}
                    w="100%"
                    type="submit"
                >Войти</Button>
            </form>
        </Box>
    </Flex>
}