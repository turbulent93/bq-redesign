"use client"

import { Button, Container } from "@chakra-ui/react"
import { useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"

type FormProps = {
    children: React.ReactNode,
    onSubmit: (value: any) => void,
    values?: Record<string, any>,
    submitText?: string
    isSubmitVisible?: boolean
    buttons?: (typeof Button)[]
    maxW?: string
    my?: number
}

export const CustomForm = ({onSubmit, children, values, buttons, submitText, maxW, isSubmitVisible = true, my = 8}: FormProps) => {
    const methods = useForm()

    useEffect(() => {
        methods.reset(values)
    }, [values])

    return <Container maxW={maxW ?? "600px"} my={my}>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                {children}
                <Button mt={2} type="submit" display={!isSubmitVisible ? "none" : undefined}>
                    {submitText ?? "Отправить"}
                </Button>
                {
                    buttons && buttons.map((Btn, index) => <Btn key={index}/>)
                }
            </form>
        </FormProvider>
    </Container>
}