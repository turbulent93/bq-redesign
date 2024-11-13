import { CustomForm } from "@/components/CustomForm"
import { CustomSelect } from "@/components/CustomSelect"
import { FileUpload } from "@/components/FileUpload"
import { CreateOrUpdateGalleryRequest, GalleryDto, ServiceDto } from "@/services/client"
import { servicesClient } from "@/services/services"
import { nameof } from "@/utils/nameof"
import { useQuery } from "react-query";

type FormProps = {
    mutate: (request: CreateOrUpdateGalleryRequest) => void,
    values?: GalleryDto
}

export const Form = ({mutate, values}: FormProps) => {
    const {data: services} = useQuery(
        ["get services"],
        () => servicesClient.get({page: undefined, size: undefined}), {
            select: (data) => data.list.map(i => ({label: i.name, value: i.id}))
        }
    )

    return <CustomForm
        onSubmit={mutate}
        values={{
            id: values?.id,
            images: [values?.imageId],
            serviceId: values?.serviceId
        } as CreateOrUpdateGalleryRequest}
    >
        <FileUpload
            name={nameof<CreateOrUpdateGalleryRequest>("images")}
            multiple={true}
        />
        <CustomSelect
            label="Услуга"
            name={nameof<CreateOrUpdateGalleryRequest>("serviceId")}
            required
            options={services ?? []}
            defaultValue={services?.find(i => i.value == values?.id)}
        />
    </CustomForm>
}