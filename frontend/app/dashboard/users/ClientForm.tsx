import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { UserDto } from "@/services/client"
import { nameof } from "@/utils/nameof"
import { CustomSelect } from "@/components/CustomSelect"
import { useState } from "react"
import { Box, Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text, useDisclosure } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { FileUpload } from "@/components/FileUpload"
import { specializationsClient, usersClient } from "@/services/services"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useRouter } from "next/navigation"
import { CLIENT_ROLE_NAME, ROLE_NAMES } from "@/utils/constants"
import { PunchMapCard } from "@/components/cards/PunchMapCard"
import { ClientAppointments } from "@/app/profile/ClientAppointments"
import { useFormContext } from "react-hook-form"
import { BonusCount } from "@/app/profile/BonusCount"

type FormProps = {
    mutate: (item: UserDto) => void,
    values?: UserDto
}

const PunchMap = ({values}: {values?: UserDto}) => {
    const {watch} = useFormContext()

    const stepsCount = watch(nameof<UserDto>("stepsCount"))

    return <>
        {
            values?.punchMapId && <PunchMapCard
                {
                    ...values?.punchMap!
                }
                stepsCount={stepsCount}
                items={values?.punchMap?.punchMapPromos}
                showProgress
            />
        }
    </>
}

export const ClientForm = ({mutate, values}: FormProps) => {
    return <CustomForm
        onSubmit={(v) => mutate({...v, role: CLIENT_ROLE_NAME})}
        values={values}
        isSubmitVisible={false}
    >
        <Flex alignItems={"center"} justifyContent={"space-between"} my={3}>
            <Text
                fontSize={16}
                fontWeight={"bold"}
            >
                {
                    values?.login
                }
            </Text>
            <BonusCount data={values} />
        </Flex>
        {
            !values && <CustomInput
                label="Номер телефона"
                type="phone"
                name={nameof<UserDto>("login")}
                required
            />
        }
        {/* <CustomSelect
            label="Роль"
            name={nameof<UserDto>("role")}
            required
            options={ROLE_NAMES.map(i => ({value: i, label: i}))}
        /> */}
        {
            // values && <>
                // <PunchMap values={values} />
                <ClientAppointments data={values} withClient />
            // </>
        }
    </CustomForm>
}