import { PunchMapDto, PunchMapPromoDto } from "@/services/client"
import { nameof } from "@/utils/nameof"
import { useFormContext } from "react-hook-form"
import { PunchMapCard } from "@/components/cards/PunchMapCard"
import { useQuery } from "react-query"
import { promosClient } from "@/services/services"

type PunchMapTemplateProps = {
    items?: PunchMapPromoDto[]
    setItems: (value: PunchMapPromoDto[]) => void
    onOpen?: (value: PunchMapPromoDto) => void
}

export const PunchMapTemplate = (props: PunchMapTemplateProps) => {
    const {watch} = useFormContext()

    const stepsCount = watch(nameof<PunchMapDto>("stepsCount"))
    const columnsCount = watch(nameof<PunchMapDto>("columnsCount"))

    const {data: promos} = useQuery(
        ["get promos"],
        () => promosClient.get({page: undefined, size: undefined}), {
            select: (data) => data.list
        }
    )

    return <PunchMapCard {...props} stepsCount={stepsCount} columnsCount={columnsCount} promos={promos} />
}