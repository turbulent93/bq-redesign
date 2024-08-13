import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { EmployeeDto, UserDto } from "@/services/client"
import { nameof } from "@/utils/nameof"
import { CustomSelect } from "@/components/CustomSelect"
import { useState } from "react"
import { Box, Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Text, useDisclosure } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { FileUpload } from "@/components/Scheduler/FileUpload"
import { specializationsClient, usersClient } from "@/services/services"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useRouter } from "next/navigation"
import { ROLE_NAMES } from "@/utils/constants"

type FormProps = {
    mutate: (item: UserDto) => void,
    values?: UserDto
}

export const Form = ({mutate, values}: FormProps) => {
    const queryClient = useQueryClient()
    const router = useRouter()

    // const { onOpen, onClose, isOpen } = useDisclosure()

    const [resetPassword, setResetPassword] = useState(false)

    const [file, setFile] = useState<File>()

    const {data: specializations} = useQuery(
        ["get specializations"],
        () => specializationsClient.get({page: undefined, size: undefined}), {
            select: (data) => data.list.map(i => ({label: i.name, value: i.id}))
        }
    )

    const {mutate: removeMutate} = useMutation((id: number) => usersClient.removeEmployee(id), {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: "view user"})
            // router.replace("/dashboard/users/update/" + values?.id)
            // onClose()
            router.refresh()
        }
    })

    return <CustomForm onSubmit={mutate} values={values}>
        <Flex justifyContent={"center"} position="relative">
            <FileUpload
                name={`${nameof<UserDto>("employee")}.${nameof<EmployeeDto>("fileId")}`}
            />
            {
                values?.employee?.id && <Popover
                    // isOpen={isOpen}
                    // onOpen={onOpen}
                    // onClose={onClose}
                >
                    <PopoverTrigger>
                        <Button position={"absolute"} top={0} right={0} textColor={"red.300"}>
                            <RiDeleteBin6Line />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow/>
                        <PopoverCloseButton/>
                        <PopoverHeader>
                            Удалить данные мастера?
                        </PopoverHeader>
                        <PopoverBody>
                            <Button
                                bgColor={"red.400"}
                                color={"white"}
                                _hover={{
                                    bgColor: "red.300"
                                }}
                                mr={2}
                                onClick={() => removeMutate(values?.employee?.id!)}
                            >
                                Да
                            </Button>
                            <Button>
                                Отмена
                            </Button>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            }
        </Flex>
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
                    ?.filter(i => values?.employee?.specializationIds.includes(Number(i.value)))
            }
        />
        <Text
            fontSize={16}
            fontWeight={"bold"}
            textColor={"gray.600"}
            my={4}
        >
            Данные пользователя
        </Text>
        <CustomInput
            label="Логин"
            name={nameof<UserDto>("login")}
            required
        />
        <CustomSelect
            label="Роль"
            name={nameof<UserDto>("role")}
            required
            options={ROLE_NAMES.map(i => ({value: i, label: i}))}
        />
        {
            values
                ? (resetPassword
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
                    >Изменить пароль</Text>)
                : <CustomInput
                    label="Пароль"
                    name={nameof<UserDto>("password")}
                    type="password"
                    required
                />
        }
    </CustomForm>
}