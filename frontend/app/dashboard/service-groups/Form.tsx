import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { ServiceGroupDto } from "@/services/client"
import { nameof } from "@/utils/nameof"

type FormProps = {
    mutate: (item: ServiceGroupDto) => void,
    values?: ServiceGroupDto
}

export const Form = ({mutate, values}: FormProps) => {
    return <CustomForm onSubmit={mutate} values={values}>
        <CustomInput
            label="Название"
            name={nameof<ServiceGroupDto>("name")}
            required
        />
    </CustomForm>
}