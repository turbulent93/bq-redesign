"use client"

import { Box, Button, Container } from "@chakra-ui/react"
import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"

type FormProps = {
    children: React.ReactNode,
    onSubmit: (value: any) => void,
    values?: Record<string, any>,
    submitText?: string
    submitW?: string
    isSubmitVisible?: boolean
    buttons?: (typeof Button)[]
    maxW?: string
    my?: number
    px?: number
}

export const CustomForm = ({onSubmit, children, values, buttons, submitText, maxW, isSubmitVisible = true, my = 0, submitW, px}: FormProps) => {
    const methods = useForm()

    useEffect(() => {
        methods.reset(values)
    }, [values])

    return <Container maxW={maxW ?? "600px"} my={my ?? 4} px={px}>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {children}
                <Button type="submit" display={!isSubmitVisible ? "none" : undefined} w={submitW}>
                    {submitText ? submitText : values ? "Обновить" : "Добавить"}
                </Button>
                {
                    buttons && buttons.map((Btn, index) => <Btn key={index}/>)
                }
            </form>
        </FormProvider>
    </Container>
}