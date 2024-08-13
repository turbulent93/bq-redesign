import { CustomForm } from "@/components/CustomForm"
import { CustomInput } from "@/components/CustomInput"
import { SpecializationDto } from "@/services/client"
import { nameof } from "@/utils/nameof"

type FormProps = {
    mutate: (item: SpecializationDto) => void,
    values?: SpecializationDto
}

export const Form = ({mutate, values}: FormProps) => {
    return <CustomForm onSubmit={mutate} values={values}>
        <CustomInput
            label="Название"
            name={nameof<SpecializationDto>("name")}
            required
        />
    </CustomForm>
}