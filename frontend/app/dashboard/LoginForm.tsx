"use client"

import { setTokens } from "@/api/api.handler"
import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { TokenRequest } from "@/services/client"
import { tokensClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { Box, Button, Flex, Input, InputGroup, InputRightElement, Text, useFormControlContext, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { RiEyeCloseFill, RiEyeCloseLine, RiEyeLine } from "react-icons/ri"
import { useMutation, useQuery, useQueryClient } from "react-query"

const RegistrationButton = () => {
        return <Button
            colorScheme="blackAlpha"
            w="100%"
            mt={2}
            type="submit"
        >Зарегестироваться</Button>
    }

export const LoginForm = ({type = "login"}: {type?: "register" | "login"}) => {
    const queryClient = useQueryClient()

    const {mutate} = useMutation((data: TokenRequest) => type == "login" ? tokensClient.login(data) : tokensClient.register(data), {
        onSuccess: (data) => {
            setTokens(data)
            queryClient.invalidateQueries(["check"])
        }
    })

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

            w={"260px"}
        >
            <CustomForm
                onSubmit={mutate}
                submitText={"Войти"}
                submitW="100%"
                buttons={type == "register" ? [RegistrationButton] : undefined}
                my={0}
                px={0}
            >
                <Text
                    textColor={"white"}
                    fontSize={20}
                    fontWeight={"bold"}
                    mb={4}
                >
                    Войти
                </Text>
                <CustomInput
                    name={nameof<TokenRequest>("login")}
                    label={"Логин"}
                    variant="flushed"
                    labelColor="white"
                    focusBorderColor="white"
                    type={type == "register" ? "phone" : "text"}
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