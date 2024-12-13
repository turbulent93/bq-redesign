"use client"

import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { CustomSelect } from "@/components/CustomSelect"
import { FileUpload } from "@/components/FileUpload"
import { UserDto } from "@/services/client"
import { specializationsClient, usersClient } from "@/services/services"
import { CLIENT_ROLE_NAME, MASTER_ROLE_NAME } from "@/utils/constants"
import { nameof } from "@/utils/nameof"
import { useAuth } from "@/utils/useAuth"
import { Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"

type FormProps = {
    mutate: (item: UserDto) => void,
    values?: UserDto
}

export const MasterForm = ({mutate, values}: FormProps) => {
    // const {user} = useAuth()

    const [resetPassword, setResetPassword] = useState(false)
    const queryClient = useQueryClient()
    const router = useRouter()

	// const {mutate} = useMutation((item: UserDto) => usersClient.update(Number(item.id), item), {
	// 	onSuccess: () => {
	// 		queryClient.invalidateQueries({queryKey: "get users"})
	// 		queryClient.invalidateQueries({queryKey: "check"})
    //     }
	// })

    const {data: specializations} = useQuery(
        ["get specializations"],
        () => specializationsClient.get({page: undefined, size: undefined}), {
            select: (data) => data.list.map(i => ({label: i.name, value: i.id}))
        }
    )

    const roles = [MASTER_ROLE_NAME, CLIENT_ROLE_NAME].map(i => ({value: i, label: i}))

    const [tab, setTab] = useState<number>()

    return <CustomForm onSubmit={mutate}
        // values={{...user,
        //     specializationIds: user?.specializations?.map(i => Number(i.id)) || []
        // }}
        values={values}
    >
        <FileUpload
            name={nameof<UserDto>("avatarId")}
            // employeeId={user?.id}
        />
        <CustomSelect
            label="Роль"
            name={nameof<UserDto>("role")}
            required
            options={roles}
            defaultValue={roles[0]}
        />
        <CustomInput
            label="Имя"
            name={nameof<UserDto>("fullName")}
            // required
            forceReset
        />
        <CustomSelect
            label="Специализации"
            name={nameof<UserDto>("specializationIds")}
            // required
            multiple={true}
            options={specializations ?? []}
            // defaultValue={
            //     specializations
            //         ?.filter(i => user?.specializations?.map(i => i.id).includes(Number(i.value)))
            // }
        />
        <CustomInput
            label="Логин"
            name={nameof<UserDto>("login")}
            required
        />
        {
            resetPassword
                ? <>
                    <CustomInput
                        label="Старый пароль"
                        name={nameof<UserDto>("password")}
                        type="password"
                        required
                    />
                    <CustomInput
                        label="Новый пароль"
                        name={nameof<UserDto>("newPassword")}
                        type="password"
                        required
                    />
                </>
                : <Text
                    textColor={"blue.300"}
                    onClick={() => setResetPassword(true)}
                >Изменить пароль</Text>
        }
    </CustomForm>
} 