"use client"

import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { CustomSelect } from "@/components/CustomSelect"
import { EmployeeDto, UserDto } from "@/services/client"
import { specializationsClient, usersClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { useAuth } from "@/utils/useAuth"
import { Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"

export const Form = () => {
    const {user} = useAuth()

    const [resetPassword, setResetPassword] = useState(false)
    const queryClient = useQueryClient()
    const router = useRouter()

	const {mutate} = useMutation((item: UserDto) => usersClient.update(Number(item.id), item), {
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: "get users"})
			queryClient.invalidateQueries({queryKey: "check"})
        }
	})

    const {data: specializations} = useQuery(
        ["get specializations"],
        () => specializationsClient.get({page: undefined, size: undefined}), {
            select: (data) => data.list.map(i => ({label: i.name, value: i.id}))
        }
    )

    return <CustomForm onSubmit={mutate} values={user}>
        <CustomInput
            label="Имя"
            name={`${nameof<UserDto>("employee")}.${nameof<EmployeeDto>("fullName")}`}
            required
            forceReset
            // resetValue={values?.employee ? undefined : undefined}
        />
        <CustomSelect
            label="Специализации"
            name={`${nameof<UserDto>("employee")}.${nameof<EmployeeDto>("specializationIds")}`}
            required
            multiple={true}
            options={specializations ?? []}
            defaultValue={
                specializations
                    ?.filter(i => user?.employee?.specializations?.map(i => i.id).includes(Number(i.value)))
            }
        />
        {/* <Text
            fontSize={16}
            fontWeight={"bold"}
            textColor={"gray.600"}
            my={4}
        >
            Данные пользователя
        </Text> */}
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