"use client"

import { setTokens } from "@/api/api.handler"
import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { TokenRequest } from "@/services/client"
import { tokensClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Link, Text, useControllableState, useFormControlContext, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { RiEyeCloseFill, RiEyeCloseLine, RiEyeLine } from "react-icons/ri"
import { TbArrowBarToLeft } from "react-icons/tb"
import { useMutation, useQuery, useQueryClient } from "react-query"

const LoginButton = () => {
    const {getValues, formState: {isValid}} = useFormContext()
    const queryClient = useQueryClient()
    const toast = useToast()

    const {mutate: login} = useMutation((data: TokenRequest) => tokensClient.login(data), {
        onSuccess: (data) => {
            setTokens(data)
            queryClient.invalidateQueries(["check"])
        },
        onError: () => {
            toast({
                position: "top",
                status: "error",
                title: 'Неправильный логин или пароль'
            })
        }
    })

    return <Button
        w="100%"
        mt={2}
        type="submit"
        onClick={() => {
            if(isValid)
                login({...getValues()} as TokenRequest)
        }}
    >Войти</Button>
}

const RegisterButton = () => {
    const {getValues, formState: {isValid}} = useFormContext()
    const queryClient = useQueryClient()
    const toast = useToast()

    const {mutate: register} = useMutation((data: TokenRequest) => tokensClient.register(data), {
        onSuccess: (data) => {
            setTokens(data)
            queryClient.invalidateQueries(["check"])
        },
        onError: () => {
            toast({
                position: "top",
                status: "error",
                title: "Номер телефона занят"
            })
        }
    })

    return <Button
        colorScheme="blackAlpha"
        w="100%"
        mt={2}
        type="submit"
        onClick={() => {
            if(isValid)
                register({...getValues()} as TokenRequest)
        }}
    >Зарегестироваться</Button>
}

const HomeButton = () => {
    return <Link href="/" color="white">
        <Flex w="100%" alignItems="center" justifyContent={"center"} pt={2}>
            <TbArrowBarToLeft size={24} />
            <Text ml={1}>
                На главную
            </Text>
        </Flex>
    </Link>
}

export const LoginForm = ({type}: {type?: "dashboard" | "client"}) => {
    return <Flex
        alignItems="center"
        justifyContent="center"
        h="100vh"
        w="100%"
        bgGradient='linear(to-br, gray.700, red.500)'
        // position="relative"
    >
        {/* <Link href="/" color="white" position="absolute" top={0} left={0}>
            <Flex w="100%" alignItems="center" justifyContent={"center"} p={2}>
                <TbArrowBarToLeft size={24} />
                <Text ml={1}>
                    На главную
                </Text>
            </Flex>
        </Link> */}
        <Box 
            // borderRadius="5px"
            p={4}
            boxShadow='md'

            w={"260px"}
        >
            <CustomForm
                onSubmit={() => {}}
                isSubmitVisible={false}
                // submitText={"Войти"}
                // submitW="100%"
                buttons={type == "client" ? [LoginButton, RegisterButton, HomeButton] : [LoginButton]}
                my={0}
                px={0}
            >
                {/* <Text
                    textColor={"white"}
                    fontSize={20}
                    fontWeight={"bold"}
                    mb={4}
                >
                    Войти
                </Text> */}
                <CustomInput
                    name={nameof<TokenRequest>("login")}
                    label={type == "client" ? "Телефон" : "Логин"}
                    variant="flushed"
                    labelColor="white"
                    focusBorderColor="white"
                    type={type == "client" ? "phone" : "text"}
                    required
                    color="white"
                />
                <CustomInput
                    name={nameof<TokenRequest>("password")}
                    label={"Пароль"}
                    variant="flushed"
                    labelColor="white"
                    type="password"
                    focusBorderColor="white"
                    required
                    color="white"
                />
                {/* <Input variant={"flushed"} /> */}
            </CustomForm>
        </Box>
    </Flex>
}